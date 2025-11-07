import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}