import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';  // Fix: Import type cho Cache (TS1272)
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,  
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({ 
      data, 
      include: { variants: true, images: true, category: true, brand: true } 
    });
    // Invalidate cache sau create
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
    const { page = 1, limit = 10, search, categoryId } = query;  // Fix: Xóa brandId (TS2339)
    const skip = (page - 1) * limit;
    products = await this.prisma.product.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
        categoryId,
        // Xóa brandId
      },
      skip,
      take: limit,
      include: { variants: true, images: true, category: true, brand: true },
    });

    await this.cacheManager.set(cacheKey, products, 3600);
    console.log(`Cache set for key: ${cacheKey}`);
    return products;
  }

  async findOne(id: number): Promise<any | null> {  // Fix: Đổi type thành any | null (TS2322)
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
      await this.cacheManager.set(cacheKey, product, 1800);  // TTL 30 phút
    }

    return product;  // Giờ match type
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.prisma.product.update({ where: { id }, data });
    // Invalidate cache sau update
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.prisma.product.delete({ where: { id } });
    // Invalidate cache sau delete
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return product;
  }

  async createVariant(data: CreateVariantDto): Promise<any> {
    const variant = await this.prisma.productVariant.create({ data });
    // Invalidate product cache
    await this.cacheManager.del(`product:${data.productId}`);
    await this.cacheManager.del('products:all');
    return variant;
  }

  async addImage(data: CreateImageDto): Promise<any> {
    const image = await this.prisma.productImage.create({ data });
    // Invalidate product cache
    await this.cacheManager.del(`product:${data.productId}`);
    await this.cacheManager.del('products:all');
    return image;
  }
}