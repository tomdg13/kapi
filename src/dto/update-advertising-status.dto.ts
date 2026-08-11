import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateAdvertisingStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['active', 'inactive'], {
    message: 'advertising_status must be either "active" or "inactive"',
  })
  advertising_status: string;
}
