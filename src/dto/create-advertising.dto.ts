import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsUrl, 
  IsIn, 
  Min, 
  Max,
  Matches,
  MaxLength
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateAdvertisingDto {
  /**
   * Advertising note/description
   */
  @IsString({ message: 'Advertising note must be a string' })
  @IsNotEmpty({ message: 'Advertising note is required' })
  @MaxLength(1000, { message: 'Advertising note cannot exceed 1000 characters' })
  advertising_note: string;

  /**
   * Base64 encoded image string (optional)
   * Format: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
   */
  @IsOptional()
  @IsString({ message: 'Advertising photo must be a base64 string' })
  @Matches(
    /^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/,
    { message: 'Invalid base64 image format. Supported formats: jpeg, jpg, png, gif, webp' }
  )
  advertising_photo?: string;

  /**
   * Display index/order for sorting advertisements
   */
  @IsNumber({}, { message: 'Advertising index must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Advertising index must be 0 or greater' })
  @Max(9999, { message: 'Advertising index cannot exceed 9999' })
  advertising_index: number;

  /**
   * Status of the advertisement
   * Allowed values: 'active', 'inactive', 'pending', 'expired'
   */
  @IsString({ message: 'Advertising status must be a string' })
  @IsNotEmpty({ message: 'Advertising status is required' })
  @IsIn(['active', 'inactive', 'pending', 'expired'], {
    message: 'Advertising status must be one of: active, inactive, pending, expired'
  })
  advertising_status: string;

  /**
   * Optional URL link for the advertisement
   */
  @IsOptional()
  @IsString({ message: 'Advertising link must be a string' })
  @IsUrl({}, { message: 'Advertising link must be a valid URL' })
  @MaxLength(2048, { message: 'Advertising link cannot exceed 2048 characters' })
  advertising_link?: string;
}

/**
 * DTO for updating advertising (extends CreateAdvertisingDto but makes all fields optional except status)
 */
export class UpdateAdvertisingDto {
  /**
   * Advertising note/description
   */
  @IsOptional()
  @IsString({ message: 'Advertising note must be a string' })
  @IsNotEmpty({ message: 'Advertising note cannot be empty when provided' })
  @MaxLength(1000, { message: 'Advertising note cannot exceed 1000 characters' })
  advertising_note?: string;

  /**
   * Base64 encoded image string (optional)
   */
  @IsOptional()
  @IsString({ message: 'Advertising photo must be a base64 string' })
  @Matches(
    /^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/,
    { message: 'Invalid base64 image format. Supported formats: jpeg, jpg, png, gif, webp' }
  )
  advertising_photo?: string;

  /**
   * Display index/order for sorting advertisements
   */
  @IsOptional()
  @IsNumber({}, { message: 'Advertising index must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Advertising index must be 0 or greater' })
  @Max(9999, { message: 'Advertising index cannot exceed 9999' })
  advertising_index?: number;

  /**
   * Status of the advertisement
   */
  @IsOptional()
  @IsString({ message: 'Advertising status must be a string' })
  @IsNotEmpty({ message: 'Advertising status cannot be empty when provided' })
  @IsIn(['active', 'inactive', 'pending', 'expired'], {
    message: 'Advertising status must be one of: active, inactive, pending, expired'
  })
  advertising_status?: string;

  /**
   * Optional URL link for the advertisement
   */
  @IsOptional()
  @IsString({ message: 'Advertising link must be a string' })
  @IsUrl({}, { message: 'Advertising link must be a valid URL' })
  @MaxLength(2048, { message: 'Advertising link cannot exceed 2048 characters' })
  advertising_link?: string;
}

/**
 * DTO specifically for bulk operations or filtering
 */
export class AdvertisingFilterDto {
  /**
   * Filter by status
   */
  @IsOptional()
  @IsString({ message: 'Status filter must be a string' })
  @IsIn(['active', 'inactive', 'pending', 'expired'], {
    message: 'Status must be one of: active, inactive, pending, expired'
  })
  status?: string;

  /**
   * Limit number of results
   */
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number;

  /**
   * Offset for pagination
   */
  @IsOptional()
  @IsNumber({}, { message: 'Offset must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Offset must be 0 or greater' })
  offset?: number;

  /**
   * Sort by field
   */
  @IsOptional()
  @IsString({ message: 'Sort by must be a string' })
  @IsIn(['advertising_date', 'advertising_index', 'advertising_status'], {
    message: 'Sort by must be one of: advertising_date, advertising_index, advertising_status'
  })
  sortBy?: string;

  /**
   * Sort order
   */
  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  @IsIn(['ASC', 'DESC', 'asc', 'desc'], {
    message: 'Sort order must be ASC or DESC'
  })
  @Transform(({ value }) => value?.toUpperCase())
  sortOrder?: 'ASC' | 'DESC';
}