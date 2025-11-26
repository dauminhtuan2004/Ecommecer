import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UploadService } from '../upload/upload.service';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private uploadService: UploadService,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({ 
      data, 
      include: { variants: true, images: true, category: true, brand: true } 
    });
    await this.cacheManager.del('products:all');
    return product;
  }

  async findAll(query: QueryProductDto): Promise<Product[]> {
    const cacheKey = `products:${JSON.stringify(query)}`;
    let products = await this.cacheManager.get<Product[]>(cacheKey);
    if (products) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return products;
    }

    console.log(`Cache miss for key: ${cacheKey} - querying DB`);
    const { page = 1, limit = 10, search, categoryId } = query;
    const skip = (page - 1) * limit;
    products = await this.prisma.product.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
        categoryId,
      },
      skip,
      take: limit,
      include: { variants: true, images: true, category: true, brand: true },
    });

    await this.cacheManager.set(cacheKey, products, 3600);
    console.log(`Cache set for key: ${cacheKey}`);
    return products;
  }

  async findOne(id: number): Promise<any | null> {
    const cacheKey = `product:${id}`;
    let product = await this.cacheManager.get(cacheKey);
    if (product) {
      console.log(`Single cache hit for product ${id}`);
      return product;
    }

    product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true, category: true, brand: true },
    });

    if (product) {
      await this.cacheManager.set(cacheKey, product, 1800);
    }

    return product;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.prisma.product.update({ where: { id }, data });
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return product;
  }

  async remove(id: number): Promise<Product> {
    // Xóa ảnh trên Cloudinary trước
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true }
    });

    if (product?.images) {
      for (const image of product.images) {
        await this.deleteImageFromCloudinary(image.url);
      }
    }

    const deletedProduct = await this.prisma.product.delete({ where: { id } });
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return deletedProduct;
  }

  async createVariant(data: CreateVariantDto): Promise<any> {
    const variant = await this.prisma.productVariant.create({ data });
    await this.cacheManager.del(`product:${data.productId}`);
    await this.cacheManager.del('products:all');
    return variant;
  }

  // ============ UPLOAD ẢNH TỪ MÁY TÍNH ============
  async uploadProductImages(
    productId: number,
    files: Express.Multer.File[],
    metadata: { altText?: string; isThumbnail?: boolean }
  ): Promise<any> {
    // 1. Kiểm tra product tồn tại
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException(`Sản phẩm #${productId} không tồn tại`);
    }

    // 2. Upload lên Cloudinary
    console.log(`Uploading ${files.length} images to Cloudinary...`);
    const urls = await this.uploadService.uploadImages(files);

    // 3. Nếu set thumbnail, bỏ thumbnail cũ
    if (metadata.isThumbnail) {
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isThumbnail: false }
      });
    }

    // 4. Lưu vào DB (transaction để đảm bảo tất cả thành công)
    const images = await this.prisma.$transaction(
      urls.map((url, index) =>
        this.prisma.productImage.create({
          data: {
            productId,
            url,
            altText: metadata.altText || `${product.name} - Ảnh ${index + 1}`,
            isThumbnail: metadata.isThumbnail && index === 0, // Chỉ ảnh đầu làm thumbnail
          }
        })
      )
    );

    // 5. Invalidate cache
    await this.cacheManager.del(`product:${productId}`);
    await this.cacheManager.del('products:all');

    return {
      message: `Upload thành công ${images.length} ảnh`,
      images,
    };
  }

  // ============ XÓA ẢNH ============
  async deleteProductImage(imageId: number): Promise<any> {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      throw new NotFoundException(`Ảnh #${imageId} không tồn tại`);
    }

    // Xóa trên Cloudinary
    await this.deleteImageFromCloudinary(image.url);

    // Xóa trong DB
    await this.prisma.productImage.delete({
      where: { id: imageId }
    });

    // Invalidate cache
    await this.cacheManager.del(`product:${image.productId}`);
    await this.cacheManager.del('products:all');

    return {
      message: 'Xóa ảnh thành công',
      deletedImage: image,
    };
  }

  // Helper: Extract public_id và xóa trên Cloudinary
  private async deleteImageFromCloudinary(imageUrl: string): Promise<void> {
    try {
      // URL format: https://res.cloudinary.com/xxx/image/upload/v123/folder/image.jpg
      const parts = imageUrl.split('/');
      const uploadIndex = parts.indexOf('upload');
      
      if (uploadIndex === -1) return;

      // Lấy phần sau "upload/v123/"
      const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
      const publicId = pathParts.join('/').replace(/\.[^/.]+$/, ''); // Remove extension

      console.log(`Deleting from Cloudinary: ${publicId}`);
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Lỗi khi xóa ảnh trên Cloudinary:', error);
      // Không throw error để không block việc xóa trong DB
    }
  }
}