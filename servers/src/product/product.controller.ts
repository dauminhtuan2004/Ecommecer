import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, 
  UseGuards, UseInterceptors, UploadedFiles, BadRequestException 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ProductService } from './product.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { multerConfig } from '../upload/multer.config';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('price-range')
  @ApiOperation({ summary: 'Get min and max price of all products (Public)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Price range',
    schema: {
      example: {
        minPrice: 0,
        maxPrice: 5000000
      }
    }
  })
  getPriceRange() {
    return this.productService.getPriceRange();
  }

  @Get()
  @ApiOperation({ summary: 'Get all products (Public)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số sản phẩm mỗi trang' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Tìm kiếm theo tên' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number, description: 'Lọc theo danh mục' })
  @ApiQuery({ name: 'brandId', required: false, type: Number, description: 'Lọc theo thương hiệu' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Giá tối thiểu' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Giá tối đa' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sắp xếp: newest, oldest, price-asc, price-desc, name-asc, name-desc' })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean, description: 'Chỉ sản phẩm còn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of products with pagination',
    schema: {
      example: {
        data: [],
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10
      }
    }
  })
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Product details' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new product (Admin only)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update product by ID (Admin only)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete product by ID (Admin only)' })
  @ApiBody({ type: DeleteProductDto })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  remove(@Param('id') id: string, @Body() deleteProductDto: DeleteProductDto) {
    if (!deleteProductDto.confirm) {
      throw new Error('Confirm deletion required');
    }
    return this.productService.remove(+id);
  }

  @Post(':id/variant')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create variant for product (Admin only)' })
  @ApiBody({ type: CreateVariantDto })
  @ApiResponse({ status: 201, description: 'Variant created' })
  createVariant(@Param('id') id: string, @Body() createVariantDto: CreateVariantDto) {
    createVariantDto.productId = +id;
    return this.productService.createVariant(createVariantDto);
  }

  @Put('variant/:variantId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update variant by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Variant updated' })
  updateVariant(@Param('variantId') variantId: string, @Body() body: any) {
    return this.productService.updateVariant(+variantId, body);
  }

  @Delete('variant/:variantId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete variant by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Variant deleted' })
  removeVariant(@Param('variantId') variantId: string) {
    return this.productService.deleteVariant(+variantId);
  }

  // ============ ẢNH TỪ MÁY TÍNH ============
  @Post(':id/images')
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Upload images from computer to product (Admin only)',
    description: 'Upload ảnh trực tiếp từ máy tính → Cloudinary → Tự động gắn vào sản phẩm'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Chọn file từ máy tính (tối đa 10 ảnh)'
        },
        altText: { 
          type: 'string', 
          example: 'Áo thun trắng size M',
          description: 'Alt text cho SEO (optional)' 
        },
        isThumbnail: { 
          type: 'boolean', 
          example: false,
          description: 'Đặt làm ảnh thumbnail chính?' 
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Images uploaded and added to product',
    schema: {
      example: {
        message: 'Successfully uploaded 3 images',
        images: [
          {
            id: 1,
            productId: 5,
            url: 'https://res.cloudinary.com/xxx/image1.jpg',
            altText: 'Áo thun trắng',
            isThumbnail: false
          }
        ]
      }
    }
  })
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadProductImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('altText') altText?: string,
    @Body('isThumbnail') isThumbnail?: string,  // Form-data gửi string, cần parse
    @Body('variantId') variantId?: string
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất 1 file ảnh');
    }

    const isThumbnailBool = isThumbnail === 'true';
    const variantIdNum = variantId ? parseInt(variantId, 10) : undefined;

    return this.productService.uploadProductImages(+id, files, {
      altText,
      isThumbnail: isThumbnailBool,
      variantId: variantIdNum,
    });
  }

  // Delete image by ID
  @Delete('images/:imageId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete product image (Admin only)' })
  @ApiResponse({ status: 200, description: 'Image deleted' })
  async deleteProductImage(@Param('imageId') imageId: string) {
    return this.productService.deleteProductImage(+imageId);
  }
}