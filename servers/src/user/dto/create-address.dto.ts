import { IsString, IsPhoneNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Thêm import

export class CreateAddressDto {
  @ApiProperty({ 
    example: 'Nguyễn Văn A', 
    description: 'Họ và tên đầy đủ', 
    required: true 
  })
  @IsString()
  fullName: string;

  @ApiProperty({ 
    example: '0123456789', 
    description: 'Số điện thoại (định dạng VN)', 
    required: true 
  })
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty({ 
    example: '123 Đường ABC', 
    description: 'Địa chỉ chi tiết', 
    required: true 
  })
  @IsString()
  street: string;

  @ApiProperty({ 
    example: 'Hồ Chí Minh', 
    description: 'Thành phố', 
    required: true 
  })
  @IsString()
  city: string;

  @ApiProperty({ 
    example: 'Quận 1', 
    description: 'Tỉnh/Quận/Huyện (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ 
    example: '70000', 
    description: 'Mã bưu điện', 
    required: true 
  })
  @IsString()
  zipCode: string;

  @ApiProperty({ 
    example: 'Vietnam', 
    description: 'Quốc gia (tùy chọn, mặc định Vietnam)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ 
    example: true, 
    description: 'Địa chỉ mặc định? (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}