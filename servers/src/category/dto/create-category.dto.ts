import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ 
    example: 'Áo sơ mi', 
    description: 'Tên danh mục (unique)', 
    required: true 
  })
  @IsString()
  name: string;
}