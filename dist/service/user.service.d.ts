import { UserDto } from 'src/dto/user.dto';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { DataSource } from 'typeorm';
export declare class userService {
    private dataSource;
    constructor(dataSource: DataSource);
    findUserById(dto: UserDto): Promise<any>;
    findUsersByRole(dto: UserDto): Promise<any>;
    findAllCustomer(): Promise<any>;
    findAllDriver(): Promise<any>;
    findAllcartype(): Promise<any>;
    findAllBanks(): Promise<any>;
    findAllProvinces(): Promise<any>;
    findDistrictsByProvinceId(pr_id: number): Promise<any>;
    findVillagesByDistrict(dto: VillageIdDto): Promise<any>;
    addUserWithPhoto(userDto: any): Promise<{
        status: string;
        message: string;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updateUserWithPhoto(phone: string, userDto: any): Promise<{
        status: string;
        message: string;
    }>;
    updateDriver(phone: string, driverDto: any): Promise<{
        status: string;
        message: string;
    }>;
    findDriverByPhone(phone: string): Promise<any>;
    findCustomerByPhone(phone: string): Promise<any>;
    updateCustomer(phone: string, userDto: any): Promise<{
        status: string;
        message: string;
    }>;
    addProfileImage(profileDto: {
        customer_id: number;
        profile_image: string;
        role?: string;
    }): Promise<{
        status: string;
        message: string;
    }>;
    private saveProfileImage;
    getProfileImageByCustomerId(user: {
        phone: number;
        role: string;
    }): Promise<any>;
    getProfiledriver(body: {
        phone: number;
        role?: string;
    }): Promise<any>;
    getParameter(dto: {
        name: string;
    }): Promise<any>;
    getAllParameters(): Promise<any>;
    updateParameter(dto: {
        name: string;
        value: string;
    }): Promise<any>;
}
