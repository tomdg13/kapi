import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  promote_note: string;

  @IsString()
  @IsNotEmpty()
  promote_photo: string;  // base64 string expected

  @IsString()
  @IsNotEmpty()
  promote_phone: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}



export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  banner_note: string;

  @IsNotEmpty()
  @IsString()
  banner_photo: string; // Base64 image string

  @IsNotEmpty()
  @IsString()
  banner_index: string;

  @IsNotEmpty()
  @IsString()
  banner_status: string;

  @IsString()
  @IsOptional()
  banner_link?: string; // Optional but must be a string if present
}

export class CheckBannerDto {
  @IsOptional()
  @IsString()
  phone?: string; // Optional if needed for filtering
}


