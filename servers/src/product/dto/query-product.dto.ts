import { IsOptional, IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';  // Thêm import cho Swagger

export class QueryProductDto {
  @ApiProperty({ 
    example: 1, 
    description: 'Trang hiện tại (tùy chọn, mặc định 1)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ 
    example: 10, 
    description: 'Số sản phẩm mỗi trang (tùy chọn, mặc định 10)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @ApiProperty({ 
    example: 'áo thun', 
    description: 'Tìm kiếm theo tên sản phẩm (insensitive, tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: 1, 
    description: 'ID category để filter (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;
}