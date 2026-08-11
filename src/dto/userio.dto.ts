import { 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsPhoneNumber, 
  IsIn, 
  MinLength, 
  MaxLength, 
  IsBoolean, 
  IsUUID,
  IsNotEmpty,
  Matches,
  IsBase64,
  ValidateIf,
  IsInt,
  IsNumber
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Base DTO class - MUST be exported first
export class UserioDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsString()
  role?: string; // Changed from enum to string to match your DB
}

// Create DTO class - MUST be exported
export class CreateUserioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores'
  })
  username: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128)
  password: string;

  @IsString()
  @Matches(/^\d{8,15}$/, {
    message: 'Phone number must be 8-15 digits'
  })
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  document_id?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.photo && o.photo.length > 0)
  @Matches(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, {
    message: 'Photo must be a valid base64 image (jpeg, jpg, png, gif, webp)'
  })
  photo?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.photo_id && o.photo_id.length > 0)
  @Matches(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, {
    message: 'Photo ID must be a valid base64 image (jpeg, jpg, png, gif, webp)'
  })
  photo_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  village_id?: number; // Changed to number to match your DB

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  district_id?: number; // Changed to number to match your DB

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  province_id?: number; // Changed to number to match your DB

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  branch_id?: number; // Added missing field from your DB

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number; // Added missing field from your DB

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || 'active')
  status?: string; // Changed from enum to string

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || 'user')
  role?: string; // Changed from enum to string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  account_bank_id?: number; // Changed to number to match your DB

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
  @Transform(({ value }) => value || 'en')
  language?: string; // Changed from enum to string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === '1') return 'true';
    if (value === false || value === 'false' || value === '0') return 'false';
    return value || 'false';
  })
  online?: string; // Changed to string to match your DB
}

// Update DTO class - MUST be exported
export class UpdateUserioDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores'
  })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128)
  password?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8,15}$/, {
    message: 'Phone number must be 8-15 digits'
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  document_id?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.photo && o.photo.length > 0)
  @Matches(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, {
    message: 'Photo must be a valid base64 image (jpeg, jpg, png, gif, webp)'
  })
  photo?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.photo_id && o.photo_id.length > 0)
  @Matches(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, {
    message: 'Photo ID must be a valid base64 image (jpeg, jpg, png, gif, webp)'
  })
  photo_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  village_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  district_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  province_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  branch_id?: number; // Added missing field

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number; // Added missing field

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
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
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === '1') return 'true';
    if (value === false || value === 'false' || value === '0') return 'false';
    return value;
  })
  online?: string;
}

// For backwards compatibility - MUST be exported
export class UserDto extends UserioDto {}

// Response DTO matching your exact database structure - MUST be exported
export class UserioResponseDto {
  user_id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  document_id?: string;
  photo?: string;
  photo_id?: string;
  village_id?: number;
  district_id?: number;
  province_id?: number;
  branch_id?: number; // Added
  company_id?: number; // Added
  status: string;
  role: string;
  account_bank_id?: number;
  account_no?: string;
  account_name?: string;
  language: string;
  bio?: string;
  online: string; // Changed to string
}

// Search DTO for the view service - MUST be exported
export class SearchUserioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Search term must be at least 2 characters long' })
  searchTerm: string;
}

// Company code filter DTO - MUST be exported
export class CompanyCodeFilterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Company code must be at least 2 characters long' })
  companyCode: string;
}

// Explicit exports to ensure TypeScript can find them
export default {
  UserioDto,
  CreateUserioDto,
  UpdateUserioDto,
  UserDto,
  UserioResponseDto,
  SearchUserioDto,
  CompanyCodeFilterDto,
};