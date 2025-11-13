import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ProductService } from './product.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { CreateImageDto } from './dto/create-image.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@ApiBearerAuth('Authorization')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of products' })
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
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

  @Post(':id/image')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Add image to product (Admin only)' })
  @ApiBody({ type: CreateImageDto })
  @ApiResponse({ status: 201, description: 'Image added' })
  addImage(@Param('id') id: string, @Body() createImageDto: CreateImageDto) {
    createImageDto.productId = +id;
    return this.productService.addImage(createImageDto);
  }
}