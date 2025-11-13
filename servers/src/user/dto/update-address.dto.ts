import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Thêm import

export class UpdateAddressDto {
  @ApiProperty({ 
    example: true, 
    description: 'Đặt làm địa chỉ mặc định? (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}