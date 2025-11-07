import { IsString, IsPhoneNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  fullName: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}