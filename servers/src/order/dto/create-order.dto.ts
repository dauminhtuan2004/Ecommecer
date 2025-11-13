import { IsInt, IsPositive, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID variant', required: true })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  variantId: number;

  @ApiProperty({ example: 2, description: 'Số lượng', required: true })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID địa chỉ giao hàng (tùy chọn)', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  addressId?: number;

  @ApiProperty({ example: 1, description: 'ID phương thức vận chuyển (tùy chọn)', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  shippingMethodId?: number;

  @ApiProperty({ example: 'SAVE10', description: 'Mã giảm giá (tùy chọn)', required: false })
  @IsOptional()
  @IsString()
  discountCode?: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Danh sách items từ cart', required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}