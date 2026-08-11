// src/dto/create-adjustment.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class TesttDto {
  [x: string]: string;
  @IsNotEmpty()
  @IsString()
  id: string;
  // @IsNotEmpty()
  // @IsString()
  // Username: string;



  @IsString()
  @IsOptional()
  account: string;

  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  adjustmentType: string;

  @IsString()
  @IsOptional()
  customerName: string;

  @IsString()
  @IsOptional()
  description: string;
}


