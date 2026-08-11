import { IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateBookMapDto {
  @IsOptional()
  @IsInt()
  book_id?: number;

  @IsOptional()
  @IsInt()
  driver_id?: number;

  @IsOptional()
  @IsDateString()
  book_date?: string; // Must be in ISO 8601 format, e.g., "2025-07-23T08:30:00Z"
}
