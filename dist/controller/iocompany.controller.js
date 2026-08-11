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
exports.IoCompanyController = void 0;
const common_1 = require("@nestjs/common");
const iocompany_service_1 = require("../service/iocompany.service");
const iocompany_dto_1 = require("../dto/iocompany.dto");
let IoCompanyController = class IoCompanyController {
    constructor(ioCompanyService) {
        this.ioCompanyService = ioCompanyService;
    }
    async findCompanyById(id) {
        try {
            const dto = { id };
            return await this.ioCompanyService.findCompanyById(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch company',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findCompanysByStatus(query) {
        try {
            return await this.ioCompanyService.findCompanysByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch companies',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async advancedSearchCompanies(query) {
        try {
            return await this.ioCompanyService.findCompanysByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to perform advanced search',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCompanyStats(query) {
        try {
            return await this.ioCompanyService.getCompanyStats(query.company_id);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch company statistics',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCompany(createCompanyDto) {
        try {
            return await this.ioCompanyService.addCompanyWithImage(createCompanyDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create company',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCompany(id, updateCompanyDto) {
        try {
            return await this.ioCompanyService.updateCompanyWithImage(id, updateCompanyDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update company',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCompanyLogo(id, logoDto) {
        try {
            const updateDto = { logo: logoDto.logo };
            return await this.ioCompanyService.updateCompanyWithImage(id, updateDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update company logo',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCompany(id) {
        try {
            return await this.ioCompanyService.deleteCompany(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete company',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoCompanyController = IoCompanyController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoCompanyController.prototype, "findCompanyById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iocompany_dto_1.IocompanyDto]),
    __metadata("design:returntype", Promise)
], IoCompanyController.prototype, "findCompanysByStatus", null);
__decorate([
    (0, common_1.Get)('search/advanced'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iocompany_dto_1.AdvancedSearchCompanyDto]),
    __metadata("design:returntype", Promise)
], IoCompanyController.prototype, "advancedSearchCompanies", null);
__decorate([
    (0, common_1.Get)('stats/summary'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iocompany_dto_1.CompanyStatsDto]),
    __metadata("design:returntype", Promise)
], IoCompanyController.prototype, "getCompanyStats", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iocompany_dto_1.CreateIocompanyDto]),
    __metadata("design:returntype", Promise)
], IoCompanyController.prototype, "createCompany", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, iocompany_dto_1.UpdateIocompanyDto]),
    __metadata("design:returntype", Promise)
], IoCompanyController.prototype, "updateCompany", null);
__decorate([
    (0, common_1.Put)(':id/logo'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, iocompany_dto_1.UpdateCompanyLogoDto]),
    __metadata("design:returntype", Promise)
], IoCompanyController.prototype, "updateCompanyLogo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoCompanyController.prototype, "deleteCompany", null);
exports.IoCompanyController = IoCompanyController = __decorate([
    (0, common_1.Controller)('iocompany'),
    __metadata("design:paramtypes", [iocompany_service_1.IoCompanyService])
], IoCompanyController);
//# sourceMappingURL=iocompany.controller.js.map