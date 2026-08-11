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
exports.PaymentSystemController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const payment_system_service_1 = require("./payment-system.service");
const payment_system_dto_1 = require("./dto/payment-system.dto");
let PaymentSystemController = class PaymentSystemController {
    constructor(paymentSystemService) {
        this.paymentSystemService = paymentSystemService;
    }
    async createAcquirerSettlement(dto) {
        return this.paymentSystemService.createAcquirerSettlement(dto);
    }
    async getAcquirerSettlements(filters) {
        return this.paymentSystemService.getAcquirerSettlements(filters);
    }
    async importAcquirerSettlementCSV(dto) {
        return this.paymentSystemService.importAcquirerSettlementCSV(dto.csvData);
    }
    async createPspReconciliation(dto) {
        return this.paymentSystemService.createPspReconciliation(dto);
    }
    async getPspReconciliations(filters) {
        return this.paymentSystemService.getPspReconciliations(filters);
    }
    async importPspReconciliationCSV(dto) {
        return this.paymentSystemService.importPspReconciliationCSV(dto.csvData);
    }
    async createSettlementSummary(dto) {
        return this.paymentSystemService.createSettlementSummary(dto);
    }
    async getSettlementSummaries(filters) {
        return this.paymentSystemService.getSettlementSummaries(filters);
    }
    async importSettlementSummaryCSV(dto) {
        return this.paymentSystemService.importSettlementSummaryCSV(dto.csvData);
    }
    async createTransactionDetails(dto) {
        return this.paymentSystemService.createTransactionDetails(dto);
    }
    async getTransactionDetails(filters) {
        return this.paymentSystemService.getTransactionDetails(filters);
    }
    async importTransactionDetailsCSV(dto) {
        return this.paymentSystemService.importTransactionDetailsCSV(dto.csvData);
    }
    async getReconciliationReport(filters) {
        return this.paymentSystemService.getReconciliationReport(filters);
    }
    async getDailySummary(filters) {
        return this.paymentSystemService.getDailySummary(filters);
    }
    async getMerchantSummary(merchant_id, filters) {
        return this.paymentSystemService.getMerchantSummary(merchant_id, filters);
    }
    async validateTransactionExists(system_txn_id) {
        return this.paymentSystemService.validateTransactionExists(system_txn_id);
    }
    async getTableCounts() {
        return this.paymentSystemService.getTableCounts();
    }
    async getTableStructure(tableName) {
        return this.paymentSystemService.getTableStructure(tableName);
    }
    async uploadCSV(tableType, file) {
        return {
            status: 'success',
            message: `CSV upload endpoint for ${tableType} - implement CSV parsing logic`
        };
    }
};
exports.PaymentSystemController = PaymentSystemController;
__decorate([
    (0, common_1.Post)('acquirer-settlement'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.CreateAcquirerSettlementDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "createAcquirerSettlement", null);
__decorate([
    (0, common_1.Get)('acquirer-settlement'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getAcquirerSettlements", null);
__decorate([
    (0, common_1.Post)('acquirer-settlement/import-csv'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.ImportCsvDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "importAcquirerSettlementCSV", null);
__decorate([
    (0, common_1.Post)('psp-reconciliation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.CreatePspReconciliationDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "createPspReconciliation", null);
__decorate([
    (0, common_1.Get)('psp-reconciliation'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getPspReconciliations", null);
__decorate([
    (0, common_1.Post)('psp-reconciliation/import-csv'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.ImportCsvDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "importPspReconciliationCSV", null);
__decorate([
    (0, common_1.Post)('settlement-summary'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.CreateSettlementSummaryDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "createSettlementSummary", null);
__decorate([
    (0, common_1.Get)('settlement-summary'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getSettlementSummaries", null);
__decorate([
    (0, common_1.Post)('settlement-summary/import-csv'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.ImportCsvDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "importSettlementSummaryCSV", null);
__decorate([
    (0, common_1.Post)('transaction-details'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.CreateTransactionDetailsDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "createTransactionDetails", null);
__decorate([
    (0, common_1.Get)('transaction-details'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getTransactionDetails", null);
__decorate([
    (0, common_1.Post)('transaction-details/import-csv'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.ImportCsvDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "importTransactionDetailsCSV", null);
__decorate([
    (0, common_1.Get)('reports/reconciliation'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getReconciliationReport", null);
__decorate([
    (0, common_1.Get)('reports/daily-summary'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_system_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)('reports/merchant-summary/:merchant_id'),
    __param(0, (0, common_1.Param)('merchant_id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_system_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getMerchantSummary", null);
__decorate([
    (0, common_1.Get)('validate-transaction/:system_txn_id'),
    __param(0, (0, common_1.Param)('system_txn_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "validateTransactionExists", null);
__decorate([
    (0, common_1.Get)('table-counts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getTableCounts", null);
__decorate([
    (0, common_1.Get)('debug/table-structure/:tableName'),
    __param(0, (0, common_1.Param)('tableName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "getTableStructure", null);
__decorate([
    (0, common_1.Post)('upload-csv/:table_type'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('table_type')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentSystemController.prototype, "uploadCSV", null);
exports.PaymentSystemController = PaymentSystemController = __decorate([
    (0, common_1.Controller)('payment-system'),
    __metadata("design:paramtypes", [payment_system_service_1.PaymentSystemService])
], PaymentSystemController);
//# sourceMappingURL=payment-system.controller.js.map