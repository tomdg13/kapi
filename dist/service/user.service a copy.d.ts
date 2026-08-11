import { DataSource } from 'typeorm';
import { UserDto } from 'src/dto/user.dto';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
export declare class userService {
    private dataSource;
    constructor(dataSource: DataSource);
    findUserById(dto: UserDto): Promise<any>;
    findUsersByRole(dto: UserDto): Promise<any>;
    findAllBanks(): Promise<any>;
    findAllProvinces(): Promise<any>;
    findDistrictsByProvinceId(pr_id: number): Promise<any>;
    findVillagesByDistrict(dto: VillageIdDto): Promise<any>;
}
