import { IsOptional, IsString, IsInt, IsNotEmpty, Min, IsEmail, MaxLength, IsNumber, Max, IsIn, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIoStoreDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  company_id: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  group_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  merchant_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  user_id?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  store_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  store_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  store_manager?: string;

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
  @IsString()
  store_type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  opening_hours?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  square_footage?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  upi_percentage?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  visa_percentage?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  master_percentage?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  account?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  account2?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email1?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email2?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email3?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email4?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email5?: string;

  @IsOptional()
  @IsString()
  @IsIn(['online', 'offline', 'hybrid'])
  store_mode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  web?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  mcc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  account_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cif?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  approve1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  approve2?: string;
}

export class UpdateIoStoreDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  group_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  merchant_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  store_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  store_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  store_manager?: string;

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
  @IsString()
  store_type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  opening_hours?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  square_footage?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  upi_percentage?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  visa_percentage?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  master_percentage?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  account?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  account2?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email1?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email2?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email3?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email4?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email5?: string;

  @IsOptional()
  @IsString()
  @IsIn(['online', 'offline', 'hybrid'])
  store_mode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  web?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  mcc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  account_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cif?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  approve1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  approve2?: string;

  // ADD THESE APPROVAL FIELDS:
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'reapproved'])
  approval_status?: string;

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

// NEW: Approval DTO
export class UpdateStoreApprovalDto {
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

export class IoStoreDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  group_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  merchant_id?: number;

  @IsOptional()
  @IsString()
  @IsIn(['online', 'offline', 'hybrid'])
  store_mode?: string;
}

export class FindStoreByIdDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;
}

export class FindStoresByGroupDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  group_id: number;
}

export class FindStoresByMerchantDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  merchant_id: number;
}