import { IsString, IsOptional, IsEmail, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class ProfileImageDto {
  @IsNotEmpty()
  @IsNumber()
  customer_id: number;


  @IsOptional()
  @IsString()
  role?: string; // optional role

  @IsNotEmpty()
  @IsString()
  profile_image: string; // base64 string
}

export class CustomerIdDto {
  @IsNotEmpty()
  @IsNumber()
  phone: number;
}


export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  document_id?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  photo_id?: string;

  @IsOptional()
  @IsInt()
  village_id?: number;

  @IsOptional()
  @IsInt()
  district_id?: number;

  @IsOptional()
  @IsInt()
  province_id?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsInt()
  account_bank_id?: number;

  @IsOptional()
  @IsString()
  account_no?: string;

  @IsOptional()
  @IsString()
  account_name?: string;
}

export class CarDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  role?: string;
}