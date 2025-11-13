import { IsString, IsNumber, IsPositive, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Thêm import cho Swagger

export class UpdateProductDto {
  @ApiProperty({ 
    example: 'Áo thun nam cập nhật', 
    description: 'Tên sản phẩm mới (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    example: 'Áo thun cotton thoải mái, size M-XL, chất liệu mới', 
    description: 'Mô tả sản phẩm mới (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 180000, 
    description: 'Giá gốc mới (VND, tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  basePrice?: number;

  @ApiProperty({ 
    example: 2, 
    description: 'ID category mới (phải tồn tại, tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}