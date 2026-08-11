import { 
  IsOptional, 
  IsString, 
  IsInt, 
  IsNotEmpty, 
  Min, 
  MaxLength, 
  IsPositive,
  Matches,
  IsEnum,
  Max,
  IsArray,
  ArrayMinSize,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

// Base DTO with validation rules for new table structure
export class BaseIoterminalDto {

  @IsOptional()
@IsString()
terminal_pdf?: string;  // Base64 PDF data

@IsOptional()
@IsString()
@MaxLength(255, { message: 'PDF filename cannot exceed 255 characters' })
pdf_filename?: string;


  @IsOptional()
  @IsInt({ message: 'Store ID must be a number' })
  @IsPositive({ message: 'Store ID must be positive' })
  @Type(() => Number)
  store_id?: number;

  @IsOptional()
  @IsInt({ message: 'Merchant ID must be a number' })
  @IsPositive({ message: 'Merchant ID must be positive' })
  @Type(() => Number)
  merchant_id?: number;

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
  @MaxLength(255, { message: 'Terminal name cannot exceed 255 characters' })
  terminal_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Terminal code cannot exceed 50 characters' })
  @Matches(/^[A-Z0-9_-]+$/i, { message: 'Terminal code must contain only letters, numbers, underscores, and hyphens' })
  terminal_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Please provide a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Serial number cannot exceed 100 characters' })
  serial_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'SIM number cannot exceed 50 characters' })
  @Matches(/^[0-9A-F]{8,}$/i, { message: 'SIM number must be at least 8 characters' })
  sim_number?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Expire date must be a valid date in YYYY-MM-DD format' })
  expire_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Create by cannot exceed 20 characters' })
  create_by?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsInt({ message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be positive' })
  @Type(() => Number)
  user_id?: number;
}

// Create DTO
export class CreateIoterminalDto extends BaseIoterminalDto {
  @IsOptional()
  @IsInt({ message: 'Store ID must be a number' })
  @IsPositive({ message: 'Store ID must be positive' })
  @Type(() => Number)
  store_id?: number;

  @IsNotEmpty({ message: 'Company ID is required' })
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty({ message: 'Terminal name is required' })
  @IsString({ message: 'Terminal name must be a string' })
  @MaxLength(255, { message: 'Terminal name cannot exceed 255 characters' })
  terminal_name: string;
}

// Update DTO - all fields optional INCLUDING APPROVAL FIELDS
export class UpdateIoterminalDto extends PartialType(BaseIoterminalDto) {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'reapproved'])
  approval_status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  approve1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  approve2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  approved_by?: string;

  @IsOptional()
  @IsDateString()
  approved_at?: string;

  @IsOptional()
  @IsString()
  rejection_reason?: string;
}

// NEW: Approval-specific DTO
export class UpdateTerminalApprovalDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'reapproved'])
  approval_status: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  approved_by: string;

  @IsNotEmpty()
  @IsDateString()
  approved_at: string;

  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  approve1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  approve2?: string;
}

// Query DTO for filtering and searching
export class IoterminalDto {
  @IsOptional()
  @IsString()
  status?: string | 'admin';

  @IsOptional()
  @IsInt({ message: 'Store ID must be a number' })
  @IsPositive({ message: 'Store ID must be positive' })
  @Type(() => Number)
  store_id?: number;

  @IsOptional()
  @IsInt({ message: 'Merchant ID must be a number' })
  @IsPositive({ message: 'Merchant ID must be positive' })
  @Type(() => Number)
  merchant_id?: number;

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
  @IsString()
  @MaxLength(255)
  search?: string;

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

  @IsOptional()
  @IsString()
  @IsEnum([
    'terminal_name', 
    'terminal_code', 
    'created_date', 
    'updated_date', 
    'store_id', 
    'merchant_id', 
    'group_id', 
    'company_id',
    'serial_number',
    'sim_number',
    'expire_date',
    'approval_status'
  ])
  sort_by?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['ASC', 'DESC'])
  sort_order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'reapproved'])
  approval_status?: string;
}

// Find by ID DTO
export class FindTerminalByIdDto {
  @IsNotEmpty({ message: 'ID is required' })
  @IsInt({ message: 'ID must be a number' })
  @Min(1, { message: 'ID must be at least 1' })
  @Type(() => Number)
  id: number;
}

// Find multiple terminals by IDs DTO
export class FindTerminalsByIdsDto {
  @IsNotEmpty({ message: 'Terminal IDs array is required' })
  @IsArray({ message: 'Terminal IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one terminal ID is required' })
  @IsNumber({}, { each: true, message: 'Each terminal ID must be a number' })
  @IsPositive({ each: true, message: 'Each terminal ID must be positive' })
  @Type(() => Number)
  terminalIds: number[];
}

// Response DTO
export class IoterminalResponseDto {
  @IsInt()
  terminal_id: number;

  @IsOptional()
  @IsInt()
  store_id?: number;

  @IsOptional()
  @IsInt()
  merchant_id?: number;

  @IsOptional()
  @IsInt()
  group_id?: number;

  @IsOptional()
  @IsInt()
  company_id?: number;

  @IsOptional()
  @IsString()
  terminal_name?: string;

  @IsOptional()
  @IsString()
  terminal_code?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  serial_number?: string;

  @IsOptional()
  @IsString()
  sim_number?: string;

  @IsOptional()
  @IsString()
  expire_date?: string;

  @IsOptional()
  @IsString()
  create_by?: string;

  @IsOptional()
  @IsString()
  terminal_image?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  approval_status?: string;

  @IsOptional()
  @IsString()
  approve1?: string;

  @IsOptional()
  @IsString()
  approve2?: string;

  @IsOptional()
  @IsString()
  approved_by?: string;

  @IsOptional()
  @IsString()
  approved_at?: string;

  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @IsString()
  created_date: string;

  @IsString()
  updated_date: string;
}

// Multiple terminals response DTO
export class FindTerminalsByIdsResponseDto {
  status: string;
  message: string;
  data: any[];
}

// Bulk create DTO
export class BulkCreateIoterminalDto {
  @IsNotEmpty({ message: 'Terminals array is required' })
  @Type(() => CreateIoterminalDto)
  terminals: CreateIoterminalDto[];
}

// Statistics DTO
export class TerminalStatsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  store_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  merchant_id?: number;

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
  date_from?: string;

  @IsOptional()
  @IsString()
  date_to?: string;
}

// Store filtering DTO
export class FindTerminalsByStoreDto {
  @IsNotEmpty({ message: 'Store ID is required' })
  @IsInt({ message: 'Store ID must be a number' })
  @IsPositive({ message: 'Store ID must be positive' })
  @Type(() => Number)
  store_id: number;

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;
}

// Find terminals by company and store DTO
export class FindTerminalsByCompanyAndStoreDto {
  @IsNotEmpty({ message: 'Company ID is required' })
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty({ message: 'Store ID is required' })
  @IsInt({ message: 'Store ID must be a number' })
  @IsPositive({ message: 'Store ID must be positive' })
  @Type(() => Number)
  store_id: number;
}

// Find terminals by merchant DTO
export class FindTerminalsByMerchantDto {
  @IsNotEmpty({ message: 'Merchant ID is required' })
  @IsInt({ message: 'Merchant ID must be a number' })
  @IsPositive({ message: 'Merchant ID must be positive' })
  @Type(() => Number)
  merchant_id: number;

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;
}

// Find terminals by group DTO
export class FindTerminalsByGroupDto {
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

// Terminal code check DTO
export class CheckTerminalCodeDto {
  @IsNotEmpty({ message: 'Terminal code is required' })
  @IsString({ message: 'Terminal code must be a string' })
  @MaxLength(50, { message: 'Terminal code cannot exceed 50 characters' })
  terminal_code: string;

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;
}

// Find terminals by serial number DTO
export class FindTerminalsBySerialDto {
  @IsNotEmpty({ message: 'Serial number is required' })
  @IsString({ message: 'Serial number must be a string' })
  @MaxLength(100, { message: 'Serial number cannot exceed 100 characters' })
  serial_number: string;

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;
}

// Find terminals by SIM number DTO
export class FindTerminalsBySimDto {
  @IsNotEmpty({ message: 'SIM number is required' })
  @IsString({ message: 'SIM number must be a string' })
  @MaxLength(50, { message: 'SIM number cannot exceed 50 characters' })
  sim_number: string;

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;
}

// Find terminals by expire date range DTO
export class FindTerminalsByExpireDateDto {
  @IsOptional()
  @IsDateString({}, { message: 'Date from must be a valid date in YYYY-MM-DD format' })
  date_from?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date to must be a valid date in YYYY-MM-DD format' })
  date_to?: string;

  @IsOptional()
  @IsInt({ message: 'Company ID must be a number' })
  @IsPositive({ message: 'Company ID must be positive' })
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsInt({ message: 'Days before expiry must be a number' })
  @Min(0, { message: 'Days before expiry must be 0 or positive' })
  @Type(() => Number)
  days_before_expiry?: number;
}