import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class BookDto {
  @IsOptional()
  @IsInt()
  book_id?: number;

  @IsOptional()
  @IsInt()
  passenger_id?: number;



  @IsOptional()
  @IsInt()
  driver_id?: number;

  @IsOptional()
  @IsInt()
  car_id?: number;

  @IsOptional()
  @IsNumber()
  pickup_lat?: number;

  @IsOptional()
  @IsNumber()
  pickup_lon?: number;

  @IsOptional()
  @IsNumber()
  dropoff_lat?: number;

  @IsOptional()
  @IsNumber()
  dropoff_lon?: number;

  @IsOptional()
  @IsString()
  prickup?: string;

  @IsOptional()
  @IsString()
  dropoff?: string;

  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @IsOptional()
  @IsInt()
  suggeste_price?: number;

  @IsOptional()
  @IsInt()
  payment_price?: number;

  @IsOptional()
  @IsString()
  book_status?: string;

  @IsOptional()
  @IsString()
  review?: string;
}
