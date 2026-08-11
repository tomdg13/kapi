// ================================
// DTOs (Data Transfer Objects)
// ================================

import { IsOptional, IsString, IsNumber, IsEmail, IsIn, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIouserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  username?: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  document_id?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  photo_id?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  village_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  district_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  province_id?: number;

  @IsNumber()
  @Type(() => Number)
  branch_id: number;

  @IsNumber()
  @Type(() => Number)
  company_id: number;

  @IsOptional()
  @IsIn(['active', 'inactive', 'delete'])
  status?: string;

  // ========================================
  // UPDATED: Support both role_id and role_code
  // ========================================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  role_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  role_code?: string;

  // DEPRECATED: Keep for backward compatibility but will be removed
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'office', 'user', 'manager', 'staff', 'super_admin', 'supervisor', 'guest'])
  role?: string;
  // ========================================

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  account_bank_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  account_no?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  account_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  online?: string;
}

export class UpdateIouserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  username?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  document_id?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  photo_id?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  village_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  district_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  province_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  branch_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsIn(['active', 'inactive', 'delete'])
  status?: string;

  // ========================================
  // UPDATED: Support both role_id and role_code
  // ========================================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  role_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  role_code?: string;

  // DEPRECATED: Keep for backward compatibility
  @IsOptional()
  @IsString()
  role?: string;
  // ========================================

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  account_bank_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  account_no?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  account_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  online?: string;
}

export class SearchIouserDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  company_id?: number;

  // ========================================
  // UPDATED: Support both role_id and role_code
  // ========================================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  role_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  role_code?: string;

  // DEPRECATED: Keep for backward compatibility
  @IsOptional()
  @IsString()
  role?: string;
  // ========================================

  @IsOptional()
  @IsIn(['active', 'inactive', 'delete'])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search_text?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;
}

export class IouserDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  // ========================================
  // UPDATED: Support both role_id and role_code
  // ========================================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  role_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  role_code?: string;

  // DEPRECATED: Keep for backward compatibility
  @IsOptional()
  @IsString()
  role?: string;
  // ========================================

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  company_id?: number;
}