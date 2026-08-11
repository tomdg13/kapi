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
exports.IoTerminalController = void 0;
const common_1 = require("@nestjs/common");
const ioterminal_service_1 = require("../service/ioterminal.service");
const ioterminal_dto_1 = require("../dto/ioterminal.dto");
let IoTerminalController = class IoTerminalController {
    constructor(ioTerminalService) {
        this.ioTerminalService = ioTerminalService;
    }
    async findStoresByCompanyAndMerchant(company_id, merchantId) {
        try {
            return await this.ioTerminalService.findStoresByCompanyAndMerchant(company_id, merchantId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch stores',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findTerminalsByIds(dto) {
        try {
            return await this.ioTerminalService.findTerminalsByIds(dto.terminalIds);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch terminals',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTerminalsPendingApproval(companyId) {
        try {
            return await this.ioTerminalService.getTerminalsPendingApproval(companyId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch pending terminals',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findTerminalsBySerial(serialNumber, companyId) {
        try {
            const dto = {
                serial_number: serialNumber,
                company_id: companyId
            };
            return await this.ioTerminalService.findTerminalsBySerial(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch terminals by serial number',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findTerminalsBySim(simNumber, companyId) {
        try {
            const dto = {
                sim_number: simNumber,
                company_id: companyId
            };
            return await this.ioTerminalService.findTerminalsBySim(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch terminals by SIM number',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findTerminalsByExpireDate(query) {
        try {
            return await this.ioTerminalService.findTerminalsByExpireDate(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch terminals by expiry date',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTerminalStats(companyId) {
        try {
            return await this.ioTerminalService.getTerminalStats(companyId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch terminal statistics',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkTerminalCode(terminalCode, companyId) {
        try {
            const exists = await this.ioTerminalService.checkTerminalCodeExists(terminalCode, companyId);
            return {
                status: 'success',
                message: exists ? 'Terminal code already exists' : 'Terminal code is available',
                data: { exists, terminal_code: terminalCode },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to check terminal code',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findTerminalsByCompanyAndStore(companyId, storeId) {
        try {
            return await this.ioTerminalService.findTerminalsByCompanyAndStore(companyId, storeId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch terminals by company and store',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findTerminalsByStatus(query) {
        try {
            return await this.ioTerminalService.findTerminalsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch terminals',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findTerminalById(id) {
        try {
            const dto = { id };
            return await this.ioTerminalService.findTerminalById(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch terminal',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createTerminal(createTerminalDto) {
        try {
            return await this.ioTerminalService.addTerminalWithImage(createTerminalDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create terminal',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateTerminal(id, updateTerminalDto) {
        try {
            return await this.ioTerminalService.updateTerminalWithImage(id, updateTerminalDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update terminal',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateTerminalApproval(id, approvalDto) {
        try {
            return await this.ioTerminalService.updateTerminalApproval(id, approvalDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update terminal approval',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteTerminal(id) {
        try {
            return await this.ioTerminalService.deleteTerminal(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete terminal',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoTerminalController = IoTerminalController;
__decorate([
    (0, common_1.Get)('company/:company_id/merchant/:merchant_id'),
    __param(0, (0, common_1.Param)('company_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('merchant_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "findStoresByCompanyAndMerchant", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ioterminal_dto_1.FindTerminalsByIdsDto]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "findTerminalsByIds", null);
__decorate([
    (0, common_1.Get)('pending-approval'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "getTerminalsPendingApproval", null);
__decorate([
    (0, common_1.Get)('serial/:serial_number'),
    __param(0, (0, common_1.Param)('serial_number')),
    __param(1, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "findTerminalsBySerial", null);
__decorate([
    (0, common_1.Get)('sim/:sim_number'),
    __param(0, (0, common_1.Param)('sim_number')),
    __param(1, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "findTerminalsBySim", null);
__decorate([
    (0, common_1.Get)('expiring'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ioterminal_dto_1.FindTerminalsByExpireDateDto]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "findTerminalsByExpireDate", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "getTerminalStats", null);
__decorate([
    (0, common_1.Get)('check-code/:terminal_code'),
    __param(0, (0, common_1.Param)('terminal_code')),
    __param(1, (0, common_1.Query)('company_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "checkTerminalCode", null);
__decorate([
    (0, common_1.Get)('company/:company_id/store/:store_id/terminals'),
    __param(0, (0, common_1.Param)('company_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('store_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "findTerminalsByCompanyAndStore", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ioterminal_dto_1.IoterminalDto]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "findTerminalsByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "findTerminalById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ioterminal_dto_1.CreateIoterminalDto]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "createTerminal", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ioterminal_dto_1.UpdateIoterminalDto]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "updateTerminal", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ioterminal_dto_1.UpdateTerminalApprovalDto]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "updateTerminalApproval", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoTerminalController.prototype, "deleteTerminal", null);
exports.IoTerminalController = IoTerminalController = __decorate([
    (0, common_1.Controller)('ioterminal'),
    __metadata("design:paramtypes", [ioterminal_service_1.IoTerminalService])
], IoTerminalController);
//# sourceMappingURL=ioterminal.controller.js.map