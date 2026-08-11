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
exports.IoMerchantController = void 0;
const common_1 = require("@nestjs/common");
const iomerchant_service_1 = require("../service/iomerchant.service");
const iomerchant_dto_1 = require("../dto/iomerchant.dto");
let IoMerchantController = class IoMerchantController {
    constructor(ioMerchantService) {
        this.ioMerchantService = ioMerchantService;
    }
    async findMerchantsByCompanyAndGroup(company_id, group_id) {
        try {
            return await this.ioMerchantService.findMerchantsByCompanyAndGroup(company_id, group_id);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch merchants',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findMerchantsByStatus(query) {
        try {
            return await this.ioMerchantService.findMerchantsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch merchants',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findMerchantById(id) {
        try {
            const dto = { id };
            return await this.ioMerchantService.findMerchantById(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch merchant',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createMerchant(createMerchantDto) {
        try {
            return await this.ioMerchantService.addMerchantWithImage(createMerchantDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create merchant',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateMerchant(id, updateMerchantDto) {
        try {
            return await this.ioMerchantService.updateMerchantWithImage(id, updateMerchantDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update merchant',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteMerchant(id) {
        try {
            return await this.ioMerchantService.deleteMerchant(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete merchant',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoMerchantController = IoMerchantController;
__decorate([
    (0, common_1.Get)('company/:company_id/group/:group_id'),
    __param(0, (0, common_1.Param)('company_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('group_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IoMerchantController.prototype, "findMerchantsByCompanyAndGroup", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iomerchant_dto_1.IomerchantDto]),
    __metadata("design:returntype", Promise)
], IoMerchantController.prototype, "findMerchantsByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoMerchantController.prototype, "findMerchantById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iomerchant_dto_1.CreateIomerchantDto]),
    __metadata("design:returntype", Promise)
], IoMerchantController.prototype, "createMerchant", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, iomerchant_dto_1.UpdateIomerchantDto]),
    __metadata("design:returntype", Promise)
], IoMerchantController.prototype, "updateMerchant", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoMerchantController.prototype, "deleteMerchant", null);
exports.IoMerchantController = IoMerchantController = __decorate([
    (0, common_1.Controller)('iomerchant'),
    __metadata("design:paramtypes", [iomerchant_service_1.IoMerchantService])
], IoMerchantController);
//# sourceMappingURL=iomerchant.controller.js.map