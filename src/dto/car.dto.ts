import { IsString, IsOptional} from 'class-validator';

export class CarDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  role?: string;

    @IsOptional()
  @IsString()
  driver_id: string;
}





