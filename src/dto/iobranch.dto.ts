import { IsOptional, IsString, IsInt, IsNotEmpty, Min, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIobranchDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty()
  @IsString()
  branch_name: string; // Changed from 'branch' to 'branch_name'

  @IsNotEmpty()
  @IsString()
  branch_code: string; // Added branch_code as required field

  @IsOptional()
  @IsString()
  province_name?: string; // Added province_name

  @IsOptional()
  @IsString()
  address?: string; // Added address

  @IsOptional()
  @IsString()
  phone?: string; // Added phone

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string; // Added email with email validation

  @IsOptional()
  @IsString()
  manager_name?: string; // Added manager_name

  @IsOptional()
  @IsString()
  image?: string; // base64 string
}

export class UpdateIobranchDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsString()
  branch_name?: string; // Changed from 'branch' to 'branch_name'

  @IsOptional()
  @IsString()
  branch_code?: string; // Added branch_code

  @IsOptional()
  @IsString()
  province_name?: string; // Added province_name

  @IsOptional()
  @IsString()
  address?: string; // Added address

  @IsOptional()
  @IsString()
  phone?: string; // Added phone

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string; // Added email with email validation

  @IsOptional()
  @IsString()
  manager_name?: string; // Added manager_name

  @IsOptional()
  @IsString()
  image?: string; // base64 string
}

export class IobranchDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;
}

export class FindbranchByIdDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;
}