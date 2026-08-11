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
exports.SettlementDetailsController = void 0;
const common_1 = require("@nestjs/common");
const settlement_details_service_1 = require("../service/settlement_details.service");
const settlement_details_dto_1 = require("../dto/settlement_details.dto");
let SettlementDetailsController = class SettlementDetailsController {
    constructor(settlementDetailsService) {
        this.settlementDetailsService = settlementDetailsService;
    }
    async create(createDto) {
        try {
            return await this.settlementDetailsService.create(createDto);
        }
        catch (error) {
            throw error;
        }
    }
    async checkDuplicates(body) {
        try {
            const { company_id, system_transaction_ids } = body;
            if (!company_id || !system_transaction_ids || !Array.isArray(system_transaction_ids)) {
                throw new common_1.BadRequestException('Invalid request parameters. company_id and system_transaction_ids array are required.');
            }
            if (system_transaction_ids.length === 0) {
                return {
                    status: 'success',
                    message: 'Duplicate check completed',
                    data: {
                        duplicates: [],
                        total_checked: 0,
                        duplicate_count: 0,
                    },
                };
            }
            const existingRecords = await this.settlementDetailsService.findBySystemTransactionIds(company_id, system_transaction_ids);
            const duplicates = existingRecords.map(record => record.system_transaction_id);
            return {
                status: 'success',
                message: 'Duplicate check completed',
                data: {
                    duplicates,
                    total_checked: system_transaction_ids.length,
                    duplicate_count: duplicates.length,
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to check duplicates',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(company_id, start_date, end_date, transaction_type, reconciliation_flag, transaction_status, funding_type, crossborder_flag, merchant_nation, issuer_country, payment_brand, source_filename, api_code, limit, offset) {
        const filters = {};
        if (company_id !== undefined)
            filters.company_id = Number(company_id);
        if (start_date)
            filters.start_date = start_date;
        if (end_date)
            filters.end_date = end_date;
        if (transaction_type)
            filters.transaction_type = transaction_type;
        if (reconciliation_flag)
            filters.reconciliation_flag = reconciliation_flag;
        if (transaction_status)
            filters.transaction_status = transaction_status;
        if (funding_type)
            filters.funding_type = funding_type;
        if (crossborder_flag)
            filters.crossborder_flag = crossborder_flag;
        if (merchant_nation)
            filters.merchant_nation = merchant_nation;
        if (issuer_country)
            filters.issuer_country = issuer_country;
        if (payment_brand)
            filters.payment_brand = payment_brand;
        if (source_filename)
            filters.source_filename = source_filename;
        if (api_code)
            filters.api_code = api_code;
        if (limit !== undefined)
            filters.limit = Number(limit);
        if (offset !== undefined)
            filters.offset = Number(offset);
        return await this.settlementDetailsService.findAll(filters);
    }
    async findByCompany(dto) {
        return await this.settlementDetailsService.findByCompany(dto);
    }
    async getSummary(dto) {
        return await this.settlementDetailsService.getSummary(dto);
    }
    async getByStatus(dto) {
        return await this.settlementDetailsService.getByStatus(dto);
    }
    async getBySourceFile(company_id, source_filename) {
        return await this.settlementDetailsService.getBySourceFile(company_id, source_filename);
    }
    async getByApiCode(company_id, api_code) {
        return await this.settlementDetailsService.getByApiCode(company_id, api_code);
    }
    async getApiCodeStats(company_id, start_date, end_date) {
        return await this.settlementDetailsService.getApiCodeStats(company_id, {
            start_date,
            end_date,
        });
    }
    async getStatistics(company_id) {
        const filters = { company_id };
        const [allTransactions, summary, unmatched, purchases, refunds] = await Promise.all([
            this.settlementDetailsService.findAll(filters),
            this.settlementDetailsService.getSummary({ company_id }),
            this.settlementDetailsService.getByStatus({ company_id, reconciliation_flag: 'Unmatched' }),
            this.settlementDetailsService.findAll({ ...filters, transaction_type: 'PURCHASE' }),
            this.settlementDetailsService.findAll({ ...filters, transaction_type: 'REFUND' }),
        ]);
        return {
            status: 'success',
            message: 'Settlement statistics fetched successfully',
            data: {
                total_transactions: allTransactions.count,
                summary: summary.data,
                unmatched_count: unmatched.count,
                purchase_count: purchases.count,
                refund_count: refunds.count,
                reconciliation_rate: allTransactions.count > 0
                    ? ((allTransactions.count - unmatched.count) / allTransactions.count * 100).toFixed(2) + '%'
                    : '0%',
            },
        };
    }
    async getUnreconciled(company_id) {
        return await this.settlementDetailsService.getByStatus({
            company_id,
            reconciliation_flag: 'Unmatched',
        });
    }
    async getDailyReport(company_id, date) {
        return await this.settlementDetailsService.getSummary({
            company_id,
            start_date: date,
            end_date: date,
        });
    }
    async getMonthlyReport(company_id, year, month) {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
        return await this.settlementDetailsService.getSummary({
            company_id,
            start_date: startDate,
            end_date: endDate,
        });
    }
    async findById(id) {
        const dto = { id };
        return await this.settlementDetailsService.findById(dto);
    }
    async update(id, updateDto) {
        return await this.settlementDetailsService.update(id, updateDto);
    }
    async delete(id) {
        return await this.settlementDetailsService.delete(id);
    }
    async createBulk(body) {
        const createDtos = body.settlements;
        if (!Array.isArray(createDtos) || createDtos.length === 0) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'settlements array is required and must not be empty',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const results = [];
        const errors = [];
        for (let i = 0; i < createDtos.length; i++) {
            try {
                const result = await this.settlementDetailsService.create(createDtos[i]);
                results.push({
                    index: i,
                    status: 'success',
                    data: result.data,
                });
            }
            catch (error) {
                errors.push({
                    index: i,
                    status: 'error',
                    message: error.response?.message || error.message,
                    data: createDtos[i],
                });
            }
        }
        const successCount = results.length;
        const errorCount = errors.length;
        return {
            status: successCount > 0 ? 'success' : 'error',
            message: `Bulk create completed. ${successCount} successful, ${errorCount} failed.`,
            summary: {
                total: createDtos.length,
                successful: successCount,
                failed: errorCount,
                success_rate: ((successCount / createDtos.length) * 100).toFixed(2) + '%',
            },
            results: results,
            errors: errors,
        };
    }
    async importCSV(body) {
        const { source_filename, csv_data } = body;
        if (!source_filename || !csv_data || !Array.isArray(csv_data)) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'source_filename and csv_data array are required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.settlementDetailsService.createFromCSV(csv_data, source_filename);
    }
};
exports.SettlementDetailsController = SettlementDetailsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [settlement_details_dto_1.CreateSettlementDetailsDto]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('check-duplicates'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "checkDuplicates", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('company_id')),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __param(3, (0, common_1.Query)('transaction_type')),
    __param(4, (0, common_1.Query)('reconciliation_flag')),
    __param(5, (0, common_1.Query)('transaction_status')),
    __param(6, (0, common_1.Query)('funding_type')),
    __param(7, (0, common_1.Query)('crossborder_flag')),
    __param(8, (0, common_1.Query)('merchant_nation')),
    __param(9, (0, common_1.Query)('issuer_country')),
    __param(10, (0, common_1.Query)('payment_brand')),
    __param(11, (0, common_1.Query)('source_filename')),
    __param(12, (0, common_1.Query)('api_code')),
    __param(13, (0, common_1.Query)('limit')),
    __param(14, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, String, String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('company'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [settlement_details_dto_1.FindByCompanyDto]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "findByCompany", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [settlement_details_dto_1.GetSummaryDto]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [settlement_details_dto_1.GetByStatusDto]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getByStatus", null);
__decorate([
    (0, common_1.Get)('source-file'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('source_filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getBySourceFile", null);
__decorate([
    (0, common_1.Get)('api-code'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('api_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getByApiCode", null);
__decorate([
    (0, common_1.Get)('api-code-stats'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getApiCodeStats", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('unreconciled'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getUnreconciled", null);
__decorate([
    (0, common_1.Get)('reports/daily'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getDailyReport", null);
__decorate([
    (0, common_1.Get)('reports/monthly'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('month', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, settlement_details_dto_1.UpdateSettlementDetailsDto]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "createBulk", null);
__decorate([
    (0, common_1.Post)('import-csv'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettlementDetailsController.prototype, "importCSV", null);
exports.SettlementDetailsController = SettlementDetailsController = __decorate([
    (0, common_1.Controller)('settlement-details'),
    __metadata("design:paramtypes", [settlement_details_service_1.SettlementDetailsService])
], SettlementDetailsController);
//# sourceMappingURL=settlement_details.controller.js.map