import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { CheckPromoteDto, CustomerpDto, VerifyOtpDto } from 'src/dto/customer.dto';
import { ProvinceIdDto } from 'src/dto/province-id.dto';
import { customerService } from 'src/service/customer.service';
import { CheckBannerDto, CreateBannerDto, CreatePromotionDto } from 'src/dto/create-promotion.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: customerService);
    checkCustomerByPhone(dto: CustomerpDto): Promise<any>;
    OtpCustomerByPhone(dto: CustomerpDto): Promise<any>;
    checkDriverByPhone(dto: {
        phone: string;
    }): Promise<any>;
    OtpDriverByPhone(dto: CustomerpDto): Promise<any>;
    getAllBanks(): Promise<any>;
    getAllProvinces(): Promise<any>;
    getDistrictsByProvince(body: ProvinceIdDto): Promise<any>;
    getVillages(villageDto: VillageIdDto): Promise<any>;
    addCustomer(body: any): Promise<{
        status: string;
        message: string;
    }>;
    updateCustomer(phone: string, customerDto: any): Promise<{
        status: string;
        message: string;
    }>;
    addDriver(body: any): Promise<{
        status: string;
        message: string;
    }>;
    addOtp(body: {
        phone: string;
    }): Promise<any>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updatePassword(phone: string, password: string): Promise<{
        status: string;
        message: string;
    }>;
    updatedPassword(phone: string, password: string): Promise<{
        status: string;
        message: string;
    }>;
    updatedioPassword(phone: string, password: string): Promise<{
        status: string;
        message: string;
    }>;
    getNearbyPromotes(latitude: string, longitude: string): Promise<any>;
    checkPromoteByPhone(dto: CheckPromoteDto): Promise<any>;
    addPromotion(createPromotionDto: CreatePromotionDto): Promise<{
        status: string;
        message: string;
    }>;
    checkBannerByPhone(dto: CheckBannerDto): Promise<any>;
    addBanner(createBannerDto: CreateBannerDto): Promise<{
        status: string;
        message: string;
    }>;
    putUpdateBanner(id: number, bannerDto: CreateBannerDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteBanner(id: number): Promise<{
        status: string;
        message: string;
    }>;
    getCustomerById(customerId: string): Promise<any>;
    getCustomerByPhone(phone: string): Promise<any>;
    getAllCustomersWithBalance(limit?: string, offset?: string): Promise<any>;
    getCustomerLeaderboard(limit?: string): Promise<any>;
    syncCustomerBalance(phone: string): Promise<any>;
    syncAllCustomerBalances(body: {
        confirm: boolean;
    }): Promise<any>;
    getCustomerAnalytics(): Promise<any>;
    getCustomersByTier(tier: string): Promise<any>;
    getTierSummary(): Promise<{
        status: string;
        message: string;
        data: {
            platinum: {
                count: any;
                balance_range: string;
            };
            gold: {
                count: any;
                balance_range: string;
            };
            silver: {
                count: any;
                balance_range: string;
            };
            bronze: {
                count: any;
                balance_range: string;
            };
            total_tiers: number;
            generated_at: string;
        };
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        data?: undefined;
    }>;
    searchCustomers(searchTerm: string, searchBy?: string): Promise<any>;
    advancedSearchCustomers(searchCriteria: {
        name?: string;
        phone?: string;
        email?: string;
        status?: string;
        minBalance?: number;
        maxBalance?: number;
        tier?: string;
        limit?: number;
    }): Promise<{
        status: string;
        message: string;
        data: {
            search_criteria: {
                name?: string;
                phone?: string;
                email?: string;
                status?: string;
                minBalance?: number;
                maxBalance?: number;
                tier?: string;
                limit?: number;
            };
            query_built: string;
            note: string;
        };
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getInactiveCustomers(days: string): Promise<{
        status: string;
        message: string;
        data: {
            days_threshold: number;
            note: string;
        };
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getMostActiveCustomers(limit?: string): Promise<{
        status: string;
        message: string;
        data: {
            limit: number;
            note: string;
        };
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        data?: undefined;
    }>;
    verifyCustomerBalance(phone: string): Promise<any>;
    getBalanceMismatches(): Promise<any>;
    exportCustomersCSV(tier?: string): Promise<{
        status: string;
        message: string;
        data: {
            format: string;
            headers: string[];
            rows: any;
            total_records: any;
            exported_at: string;
        };
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getCustomerSystemHealth(): Promise<{
        status: string;
        message: string;
        data: {
            timestamp: string;
            customer_service: string;
            balance_integration: string;
            total_customers: any;
            active_customers: any;
            customers_with_balance: any;
        };
        error?: undefined;
        timestamp?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        timestamp: string;
        data?: undefined;
    }>;
    updateCustomerStatus(phone: string, status: string): Promise<{
        status: string;
        message: string;
    }>;
    updateCustomerOnlineStatus(phone: string, online: string): Promise<{
        status: string;
        message: string;
    }>;
}
