import { IsOptional, IsString, IsInt, IsNotEmpty, Min, IsEmail, IsEnum, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIovendorDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  vendor_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vendor_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  contact_person?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postal_code?: string;

  @IsOptional()
  @IsEnum(['input', 'output', 'both'])
  vendor_type?: 'input' | 'output' | 'both';

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  image?: string; // base64 string

  
}

export class UpdateIovendorDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  vendor_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vendor_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  contact_person?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postal_code?: string;

  @IsOptional()
  @IsEnum(['input', 'output', 'both'])
  vendor_type?: 'input' | 'output' | 'both';

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class IovendorDto {
  @IsOptional()
  @IsEnum(['active', 'inactive', 'admin'])
  status?: 'active' | 'inactive' | 'admin';

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsEnum(['input', 'output', 'both'])
  vendor_type?: 'input' | 'output' | 'both';
}

export class FindvendorByIdDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;
}

export class SearchVendorDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  search_term: string;
}

export class VendorByTypeDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty()
  @IsEnum(['input', 'output', 'both'])
  vendor_type: 'input' | 'output' | 'both';
}

// Response DTOs for better type safety
export class VendorResponseDto {
  vendor_id: number;
  company_id: number;
  vendor_name: string;
  vendor_code: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  vendor_type: 'input' | 'output' | 'both';
  status: 'active' | 'inactive';
  created_date: Date;
  updated_date: Date;
  notes: string | null;
  image: string | null;
  image_url?: string | null; // Full URL for frontend
}

export class ApiResponseDto<T> {
  status: 'success' | 'error' | 'not_found';
  message: string;
  data: T;
  error?: string;
}