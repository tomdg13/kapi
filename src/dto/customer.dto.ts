import { IsString, IsNotEmpty, IsOptional, IsDateString, Matches } from 'class-validator';

export class CustomerDto {
  @IsNotEmpty()
  id: number;  // required for findCustomerById

  @IsNotEmpty()
  @IsString()
  role: string;  // required for findCustomersByRole

  phone: string;
}

export class CreateOtpDto {
  @IsNotEmpty()
  @IsString()
  message: string;
  
  @IsOptional()
  @IsString()
  otp?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  app?: string;

  @IsOptional()
  date?: Date;
}


export class CustomerpDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  id?: number;
}

export class CheckPromoteDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  otp: string;
}

export class RequestOtpDto {
  @IsNotEmpty()
  phone: string;
}

export class CreateDriverDto {
  name: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  document_id?: string;
  photo?: string;      // base64
  photo_id?: string;   // base64
  village_id?: number;
  district_id?: number;
  province_id?: number;
  status?: string;
  role?: string;
  account_bank_id?: number;
  account_no?: string;
  account_name?: string;
  language?: string;
  bio?: string;
  online?: string;
}

// import { IsOptional, IsString, IsDateString } from 'class-validator';

export class PromoteDto {
  @IsString()
  promote_note: string;

  @IsString()
  promote_photo: string;

  @IsOptional()
  @IsDateString()
  promote_date?: string;  // Optional

  @IsString()
  promote_phone: string;

  @IsString()
  location: string;
}

