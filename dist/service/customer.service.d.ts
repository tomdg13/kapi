import { CheckPromoteDto, CustomerDto, CustomerpDto } from 'src/dto/customer.dto';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { DataSource } from 'typeorm';
import { SmsService } from './sms.service';
export declare class customerService {
    private dataSource;
    private readonly smsService;
    constructor(dataSource: DataSource, smsService: SmsService);
    findCustomerById(dto: CustomerDto): Promise<any>;
    checkCustomerByPhone(dto: CustomerpDto): Promise<any>;
    OtpCustomerByPhone(dto: CustomerpDto): Promise<any>;
    OtpDriverByPhone(dto: CustomerpDto): Promise<any>;
    checkDriverByPhone(dto: {
        phone: string;
    }): Promise<any>;
    findCustomersByRole(dto: CustomerDto): Promise<any>;
    findAllcartype(): Promise<any>;
    findAllBanks(): Promise<any>;
    findAllProvinces(): Promise<any>;
    findDistrictsByProvinceId(pr_id: number): Promise<any>;
    findVillagesByDistrict(dto: VillageIdDto): Promise<any>;
    addCustomerWithPhoto(customerDto: any): Promise<{
        status: string;
        message: string;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updateCustomerWithPhoto(phone: string, customerDto: any): Promise<{
        status: string;
        message: string;
    }>;
    updateCustomerStatus(phone: string, onlineStatus: string): Promise<{
        status: string;
        message: string;
    }>;
    updateCustomeronStatus(phone: string, onlineStatus: string): Promise<{
        status: string;
        message: string;
    }>;
    updateCustomerOnlineStatus(phone: string, onlineStatus: string): Promise<{
        status: string;
        message: string;
    }>;
    addDriverWithPhoto(driverDto: any): Promise<{
        status: string;
        message: string;
    }>;
    private saveDriverImage;
    requestOtp(dto: {
        phone: string;
    }): Promise<any>;
    create(createOtpDto: {
        phone: string;
    }): Promise<any>;
    verifyOtp(phone: string, otp: string): Promise<any>;
    private generateOtp;
    private isOtpExist;
    updateCustomerPassword(phone: string, newPassword: string): Promise<{
        status: string;
        message: string;
    }>;
    updateDriverPassword(phone: string, newPassword: string): Promise<{
        status: string;
        message: string;
    }>;
    updateioPassword(phone: string, newPassword: string): Promise<{
        status: string;
        message: string;
    }>;
    checkPromoteByPhone(dto: CheckPromoteDto): Promise<any>;
    getNearbyPromotes(dto: {
        latitude: number;
        longitude: number;
    }): Promise<any>;
    addPromotionWithPhoto(promoteDto: any): Promise<{
        status: string;
        message: string;
    }>;
    private savePromoteImage;
    getAllBanners(): Promise<any>;
    addbannerWithPhoto(bannerDto: any): Promise<{
        status: string;
        message: string;
    }>;
    private saveBannerImage;
    putUpdateBanner(id: number, bannerDto: any): Promise<{
        status: string;
        message: string;
    }>;
    deleteBanner(id: number): Promise<{
        status: string;
        message: string;
    }>;
    getCustomerWithBalance(customerId?: number, phone?: string): Promise<any>;
    getAllCustomersWithBalance(limit?: number, offset?: number): Promise<any>;
    getCustomerLeaderboard(limit?: number): Promise<any>;
    syncCustomerBalance(phone: string): Promise<any>;
    syncAllCustomerBalances(): Promise<any>;
    getCustomerAnalytics(): Promise<any>;
    getCustomersByTier(tier: string): Promise<any>;
    searchCustomers(searchTerm: string, searchBy?: string): Promise<any>;
}
