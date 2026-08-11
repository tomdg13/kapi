// src/dto/ioinventory.dto.ts
import { 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsDateString, 
  IsBoolean,
  Min,
  ValidateIf 
} from 'class-validator';
import { Transform } from 'class-transformer';



export enum InventoryStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  EXPIRED = 'expired',
  DAMAGED = 'damaged',
}

// Create Inventory DTO
export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  product_id: number;

  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : 1)
  location_id?: number = 1;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : 0)
  amount?: number = 0;

  @IsOptional()
  @IsDateString()
  expire_date?: string;

  @IsOptional()
  @IsString()
  currency_primary?: string;

  @IsOptional()
  @IsString()
  batch_number?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  supplier_id?: number;

  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus = InventoryStatus.ACTIVE;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  store_id?: number;

  @IsOptional()
  @IsString()
  store_name?: string;

  @IsOptional()
  @IsString()
  user_id?: string; // Changed to string as per schema

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  branch_id?: number;

  @IsOptional()
  @IsString()
  txntype?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  company_id?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  price?: number;
}