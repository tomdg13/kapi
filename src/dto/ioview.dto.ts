import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIoviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  company_id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateIoviewDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class IoviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  company_id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;
}

export class FindViewByIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  company_id: number;
}

// DTOs for the service methods
export class IoLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  company_id: number;
}

export class IoProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  company_id: number;
}

export class IoTerminalDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  company_id: number;
}