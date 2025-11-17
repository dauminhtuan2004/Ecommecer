import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ 
    example: 'Áo sơ mi cập nhật', 
    description: 'Tên danh mục mới (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;
}