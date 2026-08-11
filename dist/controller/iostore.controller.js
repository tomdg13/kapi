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
exports.IoStoreController = void 0;
const common_1 = require("@nestjs/common");
const iostore_service_1 = require("../service/iostore.service");
const iostore_dto_1 = require("../dto/iostore.dto");
let IoStoreController = class IoStoreController {
    constructor(ioStoreService) {
        this.ioStoreService = ioStoreService;
    }
    async findStoreById(id) {
        try {
            const dto = { id };
            return await this.ioStoreService.findStoreById(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch store',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findStoresByStatus(query) {
        try {
            return await this.ioStoreService.findStoresByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch stores',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getGroupsByCompany(companyId) {
        try {
            return await this.ioStoreService.getGroupsByCompany(companyId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch groups',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMerchantsByCompany(companyId, groupId) {
        try {
            return await this.ioStoreService.getMerchantsByCompanyAndGroup(companyId, groupId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch merchants',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findStoresByGroup(companyId, groupId) {
        try {
            const dto = { company_id: companyId, group_id: groupId };
            const query = { company_id: companyId, group_id: groupId };
            return await this.ioStoreService.findStoresByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch stores by group',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findStoresByMerchant(companyId, merchantId) {
        try {
            const dto = { company_id: companyId, merchant_id: merchantId };
            const query = { company_id: companyId, merchant_id: merchantId };
            return await this.ioStoreService.findStoresByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch stores by merchant',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createStore(createStoreDto) {
        try {
            return await this.ioStoreService.addStoreWithImage(createStoreDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create store',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateStore(id, updateStoreDto) {
        try {
            return await this.ioStoreService.updateStoreWithImage(id, updateStoreDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update store',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateStoreApproval(id, approvalData) {
        try {
            return await this.ioStoreService.updateStoreApproval(id, approvalData);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update store approval',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteStore(id) {
        try {
            return await this.ioStoreService.deleteStore(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete store',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoStoreController = IoStoreController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "findStoreById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iostore_dto_1.IoStoreDto]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "findStoresByStatus", null);
__decorate([
    (0, common_1.Get)('groups/:companyId'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "getGroupsByCompany", null);
__decorate([
    (0, common_1.Get)('merchants/:companyId'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('groupId', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "getMerchantsByCompany", null);
__decorate([
    (0, common_1.Get)('group/:companyId/:groupId'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('groupId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "findStoresByGroup", null);
__decorate([
    (0, common_1.Get)('merchant/:companyId/:merchantId'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('merchantId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "findStoresByMerchant", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iostore_dto_1.CreateIoStoreDto]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "createStore", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, iostore_dto_1.UpdateIoStoreDto]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "updateStore", null);
__decorate([
    (0, common_1.Put)(':id/approval'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, iostore_dto_1.UpdateStoreApprovalDto]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "updateStoreApproval", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoStoreController.prototype, "deleteStore", null);
exports.IoStoreController = IoStoreController = __decorate([
    (0, common_1.Controller)('iostore'),
    __metadata("design:paramtypes", [iostore_service_1.IoStoreService])
], IoStoreController);
//# sourceMappingURL=iostore.controller.js.map