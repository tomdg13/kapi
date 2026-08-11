import { ProfileImageDto } from 'src/dto/user.dto';
import { userService } from 'src/service/user.service';
import { UserDto } from 'src/dto/user.dto';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
export declare class ProvinceIdDto {
    pr_id: number;
}
export declare class UserController {
    private readonly userService;
    constructor(userService: userService);
    findById(userDto: UserDto): Promise<any>;
    findByRole(userDto: UserDto): Promise<any>;
    findAllcartype(): Promise<any>;
    findAllCustomer(): Promise<any>;
    findAllDriver(): Promise<any>;
    updateDriver(phone: string, driverDto: any): Promise<{
        status: string;
        message: string;
    }>;
    getDriverByPhone(body: {
        phone: string;
    }): Promise<any>;
    getCustomerByPhone(body: {
        phone: string;
    }): Promise<any>;
    getAllBanks(): Promise<any>;
    getAllProvinces(): Promise<any>;
    getDistrictsByProvince(body: ProvinceIdDto): Promise<any>;
    getVillages(villageDto: VillageIdDto): Promise<any>;
    addUser(body: any): Promise<{
        status: string;
        message: string;
    }>;
    updateUser(phone: string, userDto: any): Promise<{
        status: string;
        message: string;
    }>;
    updateCustomer(phone: string, userDto: any): Promise<{
        status: string;
        message: string;
    }>;
    uploadProfileImage(dto: ProfileImageDto): Promise<{
        status: string;
        message: string;
    }>;
    getProfileImage(dto: {
        phone: number;
        role: string;
    }): Promise<any>;
    getDriverProfile(body: {
        phone: number;
        role?: string;
    }): Promise<any>;
    getParameter(body: {
        name: string;
    }): Promise<any>;
    getAllParameters(): Promise<any>;
    updateParameter(body: {
        name: string;
        value: string;
    }): Promise<any>;
}
