import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Thêm import

export class UpdateUserDto {
  @ApiProperty({ 
    example: 'John Doe Updated', 
    description: 'Tên user mới (tùy chọn)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    example: 'newpassword456', 
    description: 'Mật khẩu mới (tùy chọn, tối thiểu 6 ký tự)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}