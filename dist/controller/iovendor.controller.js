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
exports.IovendorController = void 0;
const common_1 = require("@nestjs/common");
const iovendor_service_1 = require("../service/iovendor.service");
const iovendor_dto_1 = require("../dto/iovendor.dto");
let IovendorController = class IovendorController {
    constructor(iovendorService) {
        this.iovendorService = iovendorService;
    }
    async searchVendors(companyId, searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim().length === 0) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'Search term is required',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.iovendorService.searchVendors(companyId, searchTerm.trim());
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to search vendors',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getVendorsByType(companyId, vendorType) {
        try {
            return await this.iovendorService.getVendorsByType(companyId, vendorType);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch vendors by type',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findVendorById(id) {
        try {
            const dto = { id };
            return await this.iovendorService.findvendorById(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch vendor',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findVendorsByStatus(query) {
        try {
            return await this.iovendorService.findvendorsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch vendors',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createVendor(createVendorDto) {
        try {
            return await this.iovendorService.addVendor(createVendorDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create vendor',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateVendor(id, updateVendorDto) {
        try {
            return await this.iovendorService.updateVendor(id, updateVendorDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update vendor',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteVendor(id) {
        try {
            return await this.iovendorService.deleteVendor(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete vendor',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getActiveVendors(companyId) {
        try {
            const query = { company_id: companyId, status: 'active' };
            return await this.iovendorService.findvendorsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch active vendors',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getInactiveVendors(companyId) {
        try {
            const query = { company_id: companyId, status: 'inactive' };
            return await this.iovendorService.findvendorsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch inactive vendors',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllCompanyVendors(companyId) {
        try {
            const query = { company_id: companyId };
            return await this.iovendorService.findvendorsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch company vendors',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IovendorController = IovendorController;
__decorate([
    (0, common_1.Get)('search/:companyId'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "searchVendors", null);
__decorate([
    (0, common_1.Get)('type/:companyId/:vendorType'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('vendorType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "getVendorsByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "findVendorById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iovendor_dto_1.IovendorDto]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "findVendorsByStatus", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iovendor_dto_1.CreateIovendorDto]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "createVendor", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, iovendor_dto_1.UpdateIovendorDto]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "updateVendor", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "deleteVendor", null);
__decorate([
    (0, common_1.Get)('company/:companyId/active'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "getActiveVendors", null);
__decorate([
    (0, common_1.Get)('company/:companyId/inactive'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "getInactiveVendors", null);
__decorate([
    (0, common_1.Get)('company/:companyId/all'),
    __param(0, (0, common_1.Param)('companyId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IovendorController.prototype, "getAllCompanyVendors", null);
exports.IovendorController = IovendorController = __decorate([
    (0, common_1.Controller)('iovendor'),
    __metadata("design:paramtypes", [iovendor_service_1.IovendorService])
], IovendorController);
//# sourceMappingURL=iovendor.controller.js.map