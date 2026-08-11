import { IsOptional, IsString, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIoLocationDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  company_id: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  image?: string; // base64 string
}

export class UpdateIoLocationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  image?: string; // base64 string
}

export class IoLocationDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  company_id?: number;
}

export class FindLocationByIdDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;
}