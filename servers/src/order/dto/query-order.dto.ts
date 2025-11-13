import { IsOptional, IsInt, IsPositive, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class QueryOrderDto {
  @ApiProperty({ example: 1, description: 'Trang (tùy chọn)', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'Số lượng mỗi trang (tùy chọn)', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @ApiProperty({ example: 'PENDING', description: 'Lọc theo trạng thái (tùy chọn)', required: false, enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}