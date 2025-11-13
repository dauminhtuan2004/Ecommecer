import { IsInt, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';  // Thêm import

export class CreateVariantDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID sản phẩm (phải tồn tại)', 
    required: true 
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ 
    example: 'M', 
    description: 'Size (S, M, L, XL)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ 
    example: 'Red', 
    description: 'Màu sắc', 
    required: false 
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ 
    example: 50, 
    description: 'Số lượng tồn kho', 
    required: true 
  })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({ 
    example: 200000, 
    description: 'Giá variant (có thể override basePrice)', 
    required: true 
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ 
    example: 'ATN001-M-Red', 
    description: 'Mã SKU unique (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  sku?: string;
}