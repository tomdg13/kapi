import { IsOptional, IsString, IsInt, IsNotEmpty, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIoProductDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsOptional()
  @IsString()
  product_code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  // ✅ ADDED: Price field
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must have at most 2 decimal places' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  supplier_id?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  unit?: number;

  @IsOptional()
  @IsString()
  image?: string; // base64 string

  @IsOptional()
  @IsString()
  status?: string; // 'active', 'inactive', 'deleted'
}

export class UpdateIoProductDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  @IsString()
  product_code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  // ✅ ADDED: Price field
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must have at most 2 decimal places' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  supplier_id?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  unit?: number;

  @IsOptional()
  @IsString()
  image?: string; // base64 string

  @IsOptional()
  @IsString()
  status?: string;
}

export class IoProductDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;
}

export class FindProductByIdDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;
}