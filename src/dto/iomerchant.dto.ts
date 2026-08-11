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
  IsPositive
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, OmitType } from '@nestjs/mapped-types';

// Enums for better type safety
export enum MerchantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum MerchantType {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
  FRANCHISE = 'franchise',
  CORPORATE = 'corporate'
}

// Base DTO with common validation rules
export class BaseIomerchantDto {
  @IsOptional()
  @IsInt({ message: 'Group ID must be a number' })
  @IsPositive({ message: 'Group ID must be positive' })
  @Type(() => Number)
  group_id?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  merchant_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Z0-9_-]+$/i, { message: 'Merchant code must contain only letters, numbers, underscores, and hyphens' })
  merchant_code?: string; // This will be auto-generated, so it's optional in DTOs

  @IsOptional()
  @IsString()
  @MaxLength(255)
  merchant_manager?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Please provide a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
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
  @Matches(/^[0-9]{3,10}$/, { message: 'Postal code must be 3-10 digits' })
  postal_code?: string;

  @IsOptional()
  @IsEnum(MerchantType, { message: 'Merchant type must be one of: retail, wholesale, franchise, corporate' })
  merchant_type?: MerchantType;

  @IsOptional()
  @IsEnum(MerchantStatus, { message: 'Status must be one of: active, inactive, pending, suspended' })
  status?: MerchantStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  opening_hours?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Square footage must be at least 1' })
  @Type(() => Number)
  square_footage?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsString()
  image?: string; // base64 string - maps to merchant_image column

  @IsOptional()
  @IsInt({ message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be positive' })
  @Type(() => Number)
  user_id?: number; // Optional user_id for specific merchant code generation

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'UPI percentage must have at most 2 decimal places' })
  @Min(0, { message: 'UPI percentage cannot be negative' })
  @Max(100, { message: 'UPI percentage cannot exceed 100' })
  @Type(() => Number)
  upi_percentage?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Visa percentage must have at most 2 decimal places' })
  @Min(0, { message: 'Visa percentage cannot be negative' })
  @Max(100, { message: 'Visa percentage cannot exceed 100' })
  @Type(() => Number)
  visa_percentage?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Master percentage must have at most 2 decimal places' })
  @Min(0, { message: 'Master percentage cannot be negative' })
  @Max(100, { message: 'Master percentage cannot exceed 100' })
  @Type(() => Number)
  master_percentage?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  account?: string;
}

// Create DTO - only company_id and merchant_name are required, group_id defaults to 1
export class CreateIomerchantDto extends BaseIomerchantDto {
  @IsOptional()
  @IsInt({ message: 'Group ID must be a number' })
  @IsPositive({ message: 'Group ID must be positive' })
  @Type(() => Number)
  group_id?: number; // Optional, defaults to 1 in service

  @IsNotEmpty({ message: 'Company ID is required' })
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty({ message: 'Merchant name is required' })
  @IsString({ message: 'Merchant name must be a string' })
  @MaxLength(255, { message: 'Merchant name cannot exceed 255 characters' })
  merchant_name: string;

  // merchant_code is OPTIONAL - will be auto-generated
  // user_id is OPTIONAL - for specific merchant code generation
}

// Update DTO - all fields optional
export class UpdateIomerchantDto extends PartialType(OmitType(BaseIomerchantDto, [] as const)) {}

// Query DTO for filtering and searching
export class IomerchantDto {
  @IsOptional()
  @IsEnum(MerchantStatus, { message: 'Status must be one of: active, inactive, pending, suspended' })
  status?: MerchantStatus | 'admin'; // Allow 'admin' for special admin queries

  @IsOptional()
  @IsInt({ message: 'Group ID must be a number' })
  @IsPositive({ message: 'Group ID must be positive' })
  @Type(() => Number)
  group_id?: number;

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsEnum(MerchantType, { message: 'Merchant type must be one of: retail, wholesale, franchise, corporate' })
  merchant_type?: MerchantType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string; // For searching by name, code, or manager

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

  // Sorting options
  @IsOptional()
  @IsString()
  @IsEnum(['merchant_name', 'merchant_code', 'created_date', 'updated_date', 'group_id'], {
    message: 'Sort field must be one of: merchant_name, merchant_code, created_date, updated_date, group_id'
  })
  sort_by?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' })
  sort_order?: 'ASC' | 'DESC';
}

// Find by ID DTO
export class FindMerchantByIdDto {
  @IsNotEmpty({ message: 'ID is required' })
  @IsInt({ message: 'ID must be a number' })
  @Min(1, { message: 'ID must be at least 1' })
  @Type(() => Number)
  id: number;
}

// Response DTO (for API documentation and type safety)
export class IomerchantResponseDto {
  @IsInt()
  merchant_id: number;

  @IsInt()
  group_id: number;

  @IsInt()
  company_id: number;

  @IsString()
  merchant_name: string;

  @IsString()
  merchant_code: string;

  @IsOptional()
  @IsString()
  merchant_manager?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;

  @IsOptional()
  @IsEnum(MerchantType)
  merchant_type?: MerchantType;

  @IsOptional()
  @IsEnum(MerchantStatus)
  status?: MerchantStatus;

  @IsOptional()
  @IsString()
  opening_hours?: string;

  @IsOptional()
  @IsInt()
  square_footage?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  merchant_image?: string;

  @IsOptional()
  @IsString()
  image_url?: string; // Full URL to the image

  @IsOptional()
  @IsNumber()
  upi_percentage?: number;

  @IsOptional()
  @IsNumber()
  visa_percentage?: number;

  @IsOptional()
  @IsNumber()
  master_percentage?: number;

  @IsOptional()
  @IsString()
  account?: string;

  @IsString()
  created_date: string;

  @IsString()
  updated_date: string;
}

// Bulk create DTO (for creating multiple merchants at once)
export class BulkCreateIomerchantDto {
  @IsNotEmpty({ message: 'Merchants array is required' })
  @Type(() => CreateIomerchantDto)
  merchants: CreateIomerchantDto[];
}

// Statistics DTO (for dashboard queries)
export class MerchantStatsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  group_id?: number;

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
}

// Group filtering DTO (for getting merchants by group)
export class FindMerchantsByGroupDto {
  @IsNotEmpty({ message: 'Group ID is required' })
  @IsInt({ message: 'Group ID must be a number' })
  @IsPositive({ message: 'Group ID must be positive' })
  @Type(() => Number)
  group_id: number;

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;
}

// Find merchants by company and group DTO
export class FindMerchantsByCompanyAndGroupDto {
  @IsNotEmpty({ message: 'Company ID is required' })
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty({ message: 'Group ID is required' })
  @IsInt({ message: 'Group ID must be a number' })
  @IsPositive({ message: 'Group ID must be positive' })
  @Type(() => Number)
  group_id: number;
}