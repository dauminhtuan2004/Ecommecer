import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'Email để gửi link reset', 
    required: true 
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ 
    example: 'newpassword123', 
    description: 'Mật khẩu mới (tối thiểu 6 ký tự)', 
    required: true 
  })
  @IsString()
  @MinLength(6)
  password: string;
}