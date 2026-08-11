import { IsNotEmpty, IsNumber } from 'class-validator';

export class VillageIdDto {
  @IsNotEmpty()
  @IsNumber()
  district_id: number;
}
