import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateBannerStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['active', 'inactive'], {
    message: 'banner_status must be either "active" or "inactive"',
  })
  banner_status: string;
}
