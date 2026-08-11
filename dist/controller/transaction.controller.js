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
exports.TrasactionController = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../service/transaction.service");
let TrasactionController = class TrasactionController {
    constructor(trasactionService) {
        this.trasactionService = trasactionService;
    }
    async findTransactionsByPhone(phone) {
        console.log(phone);
        return await this.trasactionService.findTransactionsByPhone(phone);
    }
    async addTransaction(transactionData) {
        console.log('Controller - adding transaction:', transactionData);
        return await this.trasactionService.addTransaction(transactionData);
    }
    async getAllTransactions() {
        console.log('Controller - fetching all transactions');
        return await this.trasactionService.findTransactionsByPhone();
    }
    async getBalanceByPhone(phone) {
        console.log('Controller - getting balance for phone:', phone);
        try {
            const result = await this.trasactionService.findTransactionsByPhone(phone);
            if (result.status === 'success' && result.data.length > 0) {
                const latestTransaction = result.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                return {
                    status: 'success',
                    message: `Balance for phone ${phone}`,
                    data: {
                        phone: phone,
                        current_balance: latestTransaction.last_point || 0,
                        last_transaction_date: latestTransaction.created_at
                    }
                };
            }
            else {
                return {
                    status: 'success',
                    message: `No transactions found for phone ${phone}`,
                    data: {
                        phone: phone,
                        current_balance: 0,
                        last_transaction_date: null
                    }
                };
            }
        }
        catch (error) {
            return {
                status: 'error',
                message: 'Failed to get balance',
                error: error.message
            };
        }
    }
    async getRecentTransactions(limit = 10) {
        console.log('Controller - getting recent transactions, limit:', limit);
        return await this.trasactionService.findRecentTransactions(limit);
    }
    async getTransactionsByDateRange(phone, dateFrom, dateTo) {
        console.log('Controller - getting transactions by date range:', { phone, dateFrom, dateTo });
        return await this.trasactionService.findTransactionsByDateRange(phone, dateFrom, dateTo);
    }
};
exports.TrasactionController = TrasactionController;
__decorate([
    (0, common_1.Get)('phone/:phone?'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrasactionController.prototype, "findTransactionsByPhone", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrasactionController.prototype, "addTransaction", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrasactionController.prototype, "getAllTransactions", null);
__decorate([
    (0, common_1.Get)('balance/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrasactionController.prototype, "getBalanceByPhone", null);
__decorate([
    (0, common_1.Get)('recent/:limit?'),
    __param(0, (0, common_1.Param)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrasactionController.prototype, "getRecentTransactions", null);
__decorate([
    (0, common_1.Get)('daterange/:phone/:dateFrom/:dateTo'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Param)('dateFrom')),
    __param(2, (0, common_1.Param)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrasactionController.prototype, "getTransactionsByDateRange", null);
exports.TrasactionController = TrasactionController = __decorate([
    (0, common_1.Controller)('transaction'),
    __metadata("design:paramtypes", [transaction_service_1.TrasactionService])
], TrasactionController);
//# sourceMappingURL=transaction.controller.js.map