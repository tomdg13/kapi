import { IsNotEmpty, IsString } from "class-validator";

export class CheckNearbyPromoteDto {
    @IsString()
    @IsNotEmpty()
    latitude: number;
    @IsString()
    @IsNotEmpty()
    longitude: number;
}
