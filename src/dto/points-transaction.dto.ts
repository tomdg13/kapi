// dto/points-transaction.dto.ts
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class PointsTransactionDto {
  @IsOptional()
  @IsInt()
  txntype_id?: number;

  @IsString()
  txn_type: string;

  @IsOptional()
  @IsString()
  rrn?: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  phone_to?: string;

  @IsNumber()
  point: number;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  mobile_info?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  created_by?: number;
}