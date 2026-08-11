import { 
  IsOptional, 
  IsString, 
  IsInt, 
  IsNotEmpty, 
  Min, 
  IsEmail, 
  MaxLength, 
  IsNumber, 
  Max,
  IsEnum,
  Matches,
  IsPositive,
  IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, OmitType } from '@nestjs/mapped-types';

// Custom validator for base64 images
export function IsBase64Image() {
  return Matches(/^data:image\/(jpeg|jpg|png|gif|webp|bmp|tiff);base64,/, {
    message: 'Invalid image format. Must be a valid base64 image (jpeg, jpg, png, gif, webp, bmp, or tiff)'
  });
}

// Enums for better type safety
export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

// Base DTO matching io_company table structure
export class BaseIocompanyDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  company_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Z0-9_-]+$/i, { message: 'Company code must contain only letters, numbers, underscores, and hyphens' })
  company_code?: string; // This will be auto-generated, so it's optional in DTOs

  @IsOptional()
  @IsString()
  @MaxLength(150)
  company_name_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  business_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Z0-9-]+$/i, { message: 'Tax ID must contain only letters, numbers, and hyphens' })
  tax_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Please provide a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @IsUrl({}, { message: 'Please provide a valid website URL' })
  website?: string;

  @IsOptional()
  @IsString()
  @IsBase64Image() // Changed: Remove MaxLength for base64 string
  logo?: string; // base64 string for logo upload

  @IsOptional()
  @IsString()
  @MaxLength(255) // Keep MaxLength for stored filename
  logo_url?: string; // URL/path to stored logo

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ceo_name?: string;

  @IsOptional()
  @IsInt()
  @IsPositive({ message: 'Employee count must be positive' })
  @Type(() => Number)
  employee_count?: number;

  @IsOptional()
  @IsInt()
  @Min(1800, { message: 'Established year must be after 1800' })
  @Max(new Date().getFullYear(), { message: 'Established year cannot be in the future' })
  @Type(() => Number)
  established_year?: number;

  @IsOptional()
  @IsEnum(CompanyStatus, { message: 'Status must be one of: active, inactive, pending, suspended' })
  status?: CompanyStatus;

  // Additional fields for image handling
  @IsOptional()
  @IsString()
  @IsBase64Image() // Changed: Remove MaxLength for base64 string
  image?: string; // base64 string for profile image upload

  @IsOptional()
  @IsInt({ message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be positive' })
  @Type(() => Number)
  user_id?: number; // Optional user_id for specific company code generation
}

// Create DTO - only company_name is required
export class CreateIocompanyDto extends BaseIocompanyDto {
  @IsNotEmpty({ message: 'Company name is required' })
  @IsString({ message: 'Company name must be a string' })
  @MaxLength(150, { message: 'Company name cannot exceed 150 characters' })
  company_name: string;

  // All other fields are optional
  // company_code is OPTIONAL - will be auto-generated
  // user_id is OPTIONAL - for specific company code generation
}

// Update DTO - all fields optional
export class UpdateIocompanyDto extends PartialType(OmitType(BaseIocompanyDto, [] as const)) {}

// Query DTO for filtering and searching
export class IocompanyDto {
  @IsOptional()
  @IsEnum(CompanyStatus, { message: 'Status must be one of: active, inactive, pending, suspended' })
  status?: CompanyStatus | 'admin'; // Allow 'admin' for special admin queries

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  business_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string; // For searching by name, code, CEO name, phone, email

  // Pagination fields
  @IsOptional()
  @IsInt({ message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt({ message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  @Type(() => Number)
  limit?: number;

  // Sorting options based on io_company table columns
  @IsOptional()
  @IsString()
  @IsEnum(['company_name', 'company_code', 'business_type', 'ceo_name', 'established_year', 'employee_count', 'created_at', 'updated_at'], {
    message: 'Sort field must be one of: company_name, company_code, business_type, ceo_name, established_year, employee_count, created_at, updated_at'
  })
  sort_by?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' })
  sort_order?: 'ASC' | 'DESC';
}

// Find by ID DTO
export class FindCompanyByIdDto {
  @IsNotEmpty({ message: 'ID is required' })
  @IsInt({ message: 'ID must be a number' })
  @Min(1, { message: 'ID must be at least 1' })
  @Type(() => Number)
  id: number;
}

// Response DTO (for API documentation and type safety)
export class IocompanyResponseDto {
  @IsInt()
  company_id: number;

  @IsString()
  company_name: string;

  @IsString()
  company_code: string;

  @IsOptional()
  @IsString()
  company_name_en?: string;

  @IsOptional()
  @IsString()
  business_type?: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  logo_url?: string; // Path to stored logo

  @IsOptional()
  @IsString()
  logo_full_url?: string; // Full URL to the logo (computed in service)

  @IsOptional()
  @IsString()
  ceo_name?: string;

  @IsOptional()
  @IsInt()
  employee_count?: number;

  @IsOptional()
  @IsInt()
  established_year?: number;

  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;

  @IsString()
  created_at: string;

  @IsString()
  updated_at: string;
}

// Bulk create DTO (for creating multiple companies at once)
export class BulkCreateIocompanyDto {
  @IsNotEmpty({ message: 'Companies array is required' })
  @Type(() => CreateIocompanyDto)
  companies: CreateIocompanyDto[];
}

// Statistics DTO (for dashboard queries)
export class CompanyStatsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsString()
  date_from?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsString()
  date_to?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsString()
  business_type?: string;

  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;
}

// DTO for company logo update specifically
export class UpdateCompanyLogoDto {
  @IsNotEmpty({ message: 'Logo is required' })
  @IsString()
  @IsBase64Image() // Changed: Use custom validator instead of MaxLength
  logo: string; // base64 string
}

// DTO for company search with advanced filters
export class AdvancedSearchCompanyDto extends IocompanyDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  min_employees?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  max_employees?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  established_from?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  established_to?: number;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;
}