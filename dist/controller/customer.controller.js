"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const village_id_dto_1 = require("../auth/dto/village-id.dto");
const customer_dto_1 = require("../dto/customer.dto");
const province_id_dto_1 = require("../dto/province-id.dto");
const customer_service_1 = require("../service/customer.service");
const public_decorator_1 = require("../auth/public.decorator");
const create_promotion_dto_1 = require("../dto/create-promotion.dto");
let CustomerController = class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
    }
    async checkCustomerByPhone(dto) {
        return await this.customerService.checkCustomerByPhone(dto);
    }
    async OtpCustomerByPhone(dto) {
        return await this.customerService.OtpCustomerByPhone(dto);
    }
    async checkDriverByPhone(dto) {
        return await this.customerService.checkDriverByPhone(dto);
    }
    async OtpDriverByPhone(dto) {
        return await this.customerService.OtpDriverByPhone(dto);
    }
    async getAllBanks() {
        try {
            return await this.customerService.findAllBanks();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching banks',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllProvinces() {
        try {
            return await this.customerService.findAllProvinces();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching provinces',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDistrictsByProvince(body) {
        try {
            return await this.customerService.findDistrictsByProvinceId(body.pr_id);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching districts',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getVillages(villageDto) {
        try {
            return await this.customerService.findVillagesByDistrict(villageDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching villages',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addCustomer(body) {
        try {
            return await this.customerService.addCustomerWithPhoto(body);
        }
        catch (error) {
            console.error('addCustomer error:', error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create customer',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCustomer(phone, customerDto) {
        console.log('🟡 Received PUT /update/:phone request');
        console.log('🆔 phone param:', phone);
        console.log('📦 Request body:', JSON.stringify(customerDto, null, 2));
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.customerService.updateCustomerWithPhoto(phone, customerDto);
        console.log('✅ Update result:', result);
        return result;
    }
    async addDriver(body) {
        try {
            return await this.customerService.addDriverWithPhoto(body);
        }
        catch (error) {
            console.error('addDriver error:', error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create driver',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addOtp(body) {
        return this.customerService.create(body);
    }
    async verifyOtp(dto) {
        const isValid = await this.customerService.verifyOtp(dto.phone, dto.otp);
        if (isValid) {
            return {
                success: true,
                message: 'OTP is valid',
            };
        }
        else {
            throw new common_1.HttpException({
                success: false,
                message: 'OTP is expired or invalid',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updatePassword(phone, password) {
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!password || password.trim().length < 6) {
            throw new common_1.HttpException('Password must be at least 6 characters', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.customerService.updateCustomerPassword(phone, password);
    }
    async updatedPassword(phone, password) {
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!password || password.trim().length < 6) {
            throw new common_1.HttpException('Password must be at least 6 characters', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.customerService.updateDriverPassword(phone, password);
    }
    async updatedioPassword(phone, password) {
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!password || password.trim().length < 6) {
            throw new common_1.HttpException('Password must be at least 6 characters', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.customerService.updateioPassword(phone, password);
    }
    async getNearbyPromotes(latitude, longitude) {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lng)) {
            return {
                status: 'error',
                message: 'Invalid latitude or longitude',
                data: [],
            };
        }
        return await this.customerService.getNearbyPromotes({ latitude: lat, longitude: lng });
    }
    async checkPromoteByPhone(dto) {
        return await this.customerService.checkPromoteByPhone(dto);
    }
    async addPromotion(createPromotionDto) {
        return await this.customerService.addPromotionWithPhoto(createPromotionDto);
    }
    async checkBannerByPhone(dto) {
        return await this.customerService.getAllBanners();
    }
    async addBanner(createBannerDto) {
        console.log('🚀 Controller received body:', createBannerDto);
        return await this.customerService.addbannerWithPhoto(createBannerDto);
    }
    async putUpdateBanner(id, bannerDto) {
        return this.customerService.putUpdateBanner(id, bannerDto);
    }
    async deleteBanner(id) {
        return this.customerService.deleteBanner(id);
    }
    async getCustomerById(customerId) {
        const customerIdNum = parseInt(customerId, 10);
        if (isNaN(customerIdNum)) {
            return {
                status: 'error',
                message: 'Invalid customer ID'
            };
        }
        return await this.customerService.getCustomerWithBalance(customerIdNum);
    }
    async getCustomerByPhone(phone) {
        return await this.customerService.getCustomerWithBalance(undefined, phone);
    }
    async getAllCustomersWithBalance(limit, offset) {
        const limitNum = limit ? parseInt(limit, 10) : 50;
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        return await this.customerService.getAllCustomersWithBalance(limitNum, offsetNum);
    }
    async getCustomerLeaderboard(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return await this.customerService.getCustomerLeaderboard(limitNum);
    }
    async syncCustomerBalance(phone) {
        return await this.customerService.syncCustomerBalance(phone);
    }
    async syncAllCustomerBalances(body) {
        if (!body.confirm) {
            return {
                status: 'error',
                message: 'Balance sync requires confirmation. Send { "confirm": true } to proceed.',
            };
        }
        return await this.customerService.syncAllCustomerBalances();
    }
    async getCustomerAnalytics() {
        return await this.customerService.getCustomerAnalytics();
    }
    async getCustomersByTier(tier) {
        return await this.customerService.getCustomersByTier(tier);
    }
    async getTierSummary() {
        try {
            const [platinum, gold, silver, bronze] = await Promise.all([
                this.customerService.getCustomersByTier('PLATINUM'),
                this.customerService.getCustomersByTier('GOLD'),
                this.customerService.getCustomersByTier('SILVER'),
                this.customerService.getCustomersByTier('BRONZE')
            ]);
            return {
                status: 'success',
                message: 'Tier summary fetched successfully',
                data: {
                    platinum: {
                        count: platinum.status === 'success' ? platinum.data.count : 0,
                        balance_range: '10,000+',
                    },
                    gold: {
                        count: gold.status === 'success' ? gold.data.count : 0,
                        balance_range: '5,000 - 9,999',
                    },
                    silver: {
                        count: silver.status === 'success' ? silver.data.count : 0,
                        balance_range: '1,000 - 4,999',
                    },
                    bronze: {
                        count: bronze.status === 'success' ? bronze.data.count : 0,
                        balance_range: '0 - 999',
                    },
                    total_tiers: 4,
                    generated_at: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Failed to fetch tier summary',
                error: error.message
            };
        }
    }
    async searchCustomers(searchTerm, searchBy) {
        const searchByField = searchBy || 'all';
        return await this.customerService.searchCustomers(searchTerm, searchByField);
    }
    async advancedSearchCustomers(searchCriteria) {
        try {
            let query = `
        SELECT 
          c.*,
          COALESCE(t.calculated_balance, 0) as live_balance,
          COALESCE(t.total_transactions, 0) as total_transactions,
          CASE 
            WHEN COALESCE(t.calculated_balance, 0) >= 10000 THEN 'PLATINUM'
            WHEN COALESCE(t.calculated_balance, 0) >= 5000 THEN 'GOLD'
            WHEN COALESCE(t.calculated_balance, 0) >= 1000 THEN 'SILVER'
            ELSE 'BRONZE'
          END as tier
        FROM kd_customer c
        LEFT JOIN (
          SELECT 
            COALESCE(txn.phone, txn.phone_to) as customer_phone,
            SUM(CASE 
              WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'TRANSFER' AND txn.phone_to = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN -CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'ADJUST' AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              ELSE 0 
            END) as calculated_balance,
            COUNT(*) as total_transactions
          FROM kd_txn txn
          GROUP BY COALESCE(txn.phone, txn.phone_to)
        ) t ON c.phone = t.customer_phone
        WHERE 1=1
      `;
            const params = [];
            if (searchCriteria.name) {
                query += ' AND c.name LIKE ?';
                params.push(`%${searchCriteria.name}%`);
            }
            if (searchCriteria.phone) {
                query += ' AND c.phone LIKE ?';
                params.push(`%${searchCriteria.phone}%`);
            }
            if (searchCriteria.email) {
                query += ' AND c.email LIKE ?';
                params.push(`%${searchCriteria.email}%`);
            }
            if (searchCriteria.status) {
                query += ' AND c.status = ?';
                params.push(searchCriteria.status);
            }
            let havingClause = '';
            if (searchCriteria.minBalance !== undefined) {
                havingClause += ' HAVING COALESCE(t.calculated_balance, 0) >= ?';
                params.push(searchCriteria.minBalance);
            }
            if (searchCriteria.maxBalance !== undefined) {
                if (havingClause) {
                    havingClause += ' AND COALESCE(t.calculated_balance, 0) <= ?';
                }
                else {
                    havingClause = ' HAVING COALESCE(t.calculated_balance, 0) <= ?';
                }
                params.push(searchCriteria.maxBalance);
            }
            query += havingClause;
            query += ' ORDER BY COALESCE(t.calculated_balance, 0) DESC';
            query += ` LIMIT ${searchCriteria.limit || 50}`;
            return {
                status: 'success',
                message: 'Advanced search completed',
                data: {
                    search_criteria: searchCriteria,
                    query_built: 'Successfully built advanced search query',
                    note: 'This endpoint needs DataSource injection to execute the query'
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Advanced search failed',
                error: error.message
            };
        }
    }
    async getInactiveCustomers(days) {
        const daysNum = parseInt(days, 10) || 30;
        try {
            return {
                status: 'success',
                message: `Customers inactive for ${daysNum} days`,
                data: {
                    days_threshold: daysNum,
                    note: 'Implementation needed in service layer'
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Failed to fetch inactive customers',
                error: error.message
            };
        }
    }
    async getMostActiveCustomers(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        try {
            return {
                status: 'success',
                message: `Top ${limitNum} most active customers`,
                data: {
                    limit: limitNum,
                    note: 'Implementation needed in service layer'
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Failed to fetch most active customers',
                error: error.message
            };
        }
    }
    async verifyCustomerBalance(phone) {
        try {
            const customerResult = await this.customerService.getCustomerWithBalance(undefined, phone);
            if (customerResult.status === 'error') {
                return customerResult;
            }
            const customer = customerResult.data;
            return {
                status: 'success',
                message: 'Balance verification completed',
                data: {
                    phone: phone,
                    stored_balance: customer.current_balance,
                    calculated_balance: customer.live_balance,
                    statement_balance: customer.statement_balance,
                    balance_status: customer.balance_status,
                    verification_status: customer.balance_status === 'SYNCED' ? 'VERIFIED' : 'MISMATCH_DETECTED',
                    verified_at: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Balance verification failed',
                error: error.message
            };
        }
    }
    async getBalanceMismatches() {
        try {
            const result = await this.customerService.getAllCustomersWithBalance(1000, 0);
            if (result.status === 'error') {
                return result;
            }
            const mismatches = result.data.customers.filter(customer => customer.balance_status === 'OUT_OF_SYNC');
            return {
                status: 'success',
                message: 'Balance mismatches found',
                data: {
                    total_mismatches: mismatches.length,
                    customers_with_mismatches: mismatches,
                    checked_at: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Failed to check balance mismatches',
                error: error.message
            };
        }
    }
    async exportCustomersCSV(tier) {
        try {
            let customers;
            if (tier) {
                const result = await this.customerService.getCustomersByTier(tier);
                customers = result.status === 'success' ? result.data.customers : [];
            }
            else {
                const result = await this.customerService.getAllCustomersWithBalance(10000, 0);
                customers = result.status === 'success' ? result.data.customers : [];
            }
            const csvHeaders = [
                'Customer ID', 'Name', 'Username', 'Phone', 'Email',
                'Status', 'Current Balance', 'Live Balance', 'Tier',
                'Total Transactions', 'Last Transaction Date'
            ];
            const csvRows = customers.map(customer => [
                customer.customer_id,
                customer.name,
                customer.username,
                customer.phone,
                customer.email,
                customer.status,
                customer.current_balance,
                customer.live_balance,
                customer.tier,
                customer.total_transactions,
                customer.last_transaction_date
            ]);
            return {
                status: 'success',
                message: 'Customer export data prepared',
                data: {
                    format: 'CSV',
                    headers: csvHeaders,
                    rows: csvRows,
                    total_records: csvRows.length,
                    exported_at: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Export failed',
                error: error.message
            };
        }
    }
    async getCustomerSystemHealth() {
        try {
            const analytics = await this.customerService.getCustomerAnalytics();
            return {
                status: 'healthy',
                message: 'Customer system health check',
                data: {
                    timestamp: new Date().toISOString(),
                    customer_service: 'operational',
                    balance_integration: 'active',
                    total_customers: analytics.status === 'success' ? analytics.data.overview.total_customers : 0,
                    active_customers: analytics.status === 'success' ? analytics.data.overview.active_customers : 0,
                    customers_with_balance: analytics.status === 'success' ? analytics.data.overview.customers_with_balance : 0
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: 'Customer system health check failed',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async updateCustomerStatus(phone, status) {
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!status || status.trim().length === 0) {
            throw new common_1.HttpException('Status is required', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.customerService.updateCustomerStatus(phone, status);
    }
    async updateCustomerOnlineStatus(phone, online) {
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!online || online.trim().length === 0) {
            throw new common_1.HttpException('Online status is required', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.customerService.updateCustomeronStatus(phone, online);
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Post)('checkByPhone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CustomerpDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "checkCustomerByPhone", null);
__decorate([
    (0, common_1.Post)('CSOTPByPhone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CustomerpDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "OtpCustomerByPhone", null);
__decorate([
    (0, common_1.Post)('checkDriverByPhone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "checkDriverByPhone", null);
__decorate([
    (0, common_1.Post)('DriverOTPByPhone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CustomerpDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "OtpDriverByPhone", null);
__decorate([
    (0, common_1.Get)('bank'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAllBanks", null);
__decorate([
    (0, common_1.Get)('province'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAllProvinces", null);
__decorate([
    (0, common_1.Post)('district'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [province_id_dto_1.ProvinceIdDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getDistrictsByProvince", null);
__decorate([
    (0, common_1.Post)('villages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [village_id_dto_1.VillageIdDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getVillages", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addCustomer", null);
__decorate([
    (0, common_1.Put)('update/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Post)('addDriver'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addDriver", null);
__decorate([
    (0, common_1.Post)('addotp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Put)('update-password/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Put)('update-dpassword/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updatedPassword", null);
__decorate([
    (0, common_1.Put)('update-iopassword/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updatedioPassword", null);
__decorate([
    (0, common_1.Get)('NearbyPromotes'),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getNearbyPromotes", null);
__decorate([
    (0, common_1.Post)('PromotePhone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CheckPromoteDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "checkPromoteByPhone", null);
__decorate([
    (0, common_1.Post)('Promoteadd'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promotion_dto_1.CreatePromotionDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addPromotion", null);
__decorate([
    (0, common_1.Post)('BannerAll'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promotion_dto_1.CheckBannerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "checkBannerByPhone", null);
__decorate([
    (0, common_1.Post)('AddBanner'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promotion_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addBanner", null);
__decorate([
    (0, common_1.Put)('UpdateBanner/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_promotion_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "putUpdateBanner", null);
__decorate([
    (0, common_1.Delete)('DeleteBanner/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "deleteBanner", null);
__decorate([
    (0, common_1.Get)(':customerId'),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerById", null);
__decorate([
    (0, common_1.Get)('phone/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerByPhone", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAllCustomersWithBalance", null);
__decorate([
    (0, common_1.Get)('leaderboard/:limit?'),
    __param(0, (0, common_1.Param)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerLeaderboard", null);
__decorate([
    (0, common_1.Post)('sync/balance/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "syncCustomerBalance", null);
__decorate([
    (0, common_1.Post)('admin/sync-all-balances'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "syncAllCustomerBalances", null);
__decorate([
    (0, common_1.Get)('analytics/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerAnalytics", null);
__decorate([
    (0, common_1.Get)('tier/:tier'),
    __param(0, (0, common_1.Param)('tier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomersByTier", null);
__decorate([
    (0, common_1.Get)('analytics/tiers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getTierSummary", null);
__decorate([
    (0, common_1.Get)('search/:searchTerm'),
    __param(0, (0, common_1.Param)('searchTerm')),
    __param(1, (0, common_1.Query)('searchBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "searchCustomers", null);
__decorate([
    (0, common_1.Post)('search/advanced'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "advancedSearchCustomers", null);
__decorate([
    (0, common_1.Get)('inactive/:days'),
    __param(0, (0, common_1.Param)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getInactiveCustomers", null);
__decorate([
    (0, common_1.Get)('analytics/most-active/:limit?'),
    __param(0, (0, common_1.Param)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getMostActiveCustomers", null);
__decorate([
    (0, common_1.Get)('verify/balance/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "verifyCustomerBalance", null);
__decorate([
    (0, common_1.Get)('admin/balance-mismatches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getBalanceMismatches", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    __param(0, (0, common_1.Query)('tier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "exportCustomersCSV", null);
__decorate([
    (0, common_1.Get)('admin/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCustomerSystemHealth", null);
__decorate([
    (0, common_1.Put)('updateStatus'),
    __param(0, (0, common_1.Query)('phone')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateCustomerStatus", null);
__decorate([
    (0, common_1.Put)('updateOnlineStatus'),
    __param(0, (0, common_1.Query)('phone')),
    __param(1, (0, common_1.Query)('online')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateCustomerOnlineStatus", null);
exports.CustomerController = CustomerController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('customer'),
    __metadata("design:paramtypes", [customer_service_1.customerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map