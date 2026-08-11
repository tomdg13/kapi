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
exports.IoLocationController = void 0;
const common_1 = require("@nestjs/common");
const iolocation_service_1 = require("../service/iolocation.service");
const iolocation_dto_1 = require("../dto/iolocation.dto");
let IoLocationController = class IoLocationController {
    constructor(ioLocationService) {
        this.ioLocationService = ioLocationService;
    }
    async findLocationById(id) {
        try {
            const dto = { id };
            return await this.ioLocationService.findLocationById(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch location',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findLocationsByStatus(query) {
        try {
            return await this.ioLocationService.findLocationsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch locations',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createLocation(createLocationDto) {
        try {
            return await this.ioLocationService.addLocationWithImage(createLocationDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create location',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateLocation(id, updateLocationDto) {
        try {
            return await this.ioLocationService.updateLocationWithImage(id, updateLocationDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update location',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteLocation(id) {
        try {
            return await this.ioLocationService.deleteLocation(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete location',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoLocationController = IoLocationController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoLocationController.prototype, "findLocationById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iolocation_dto_1.IoLocationDto]),
    __metadata("design:returntype", Promise)
], IoLocationController.prototype, "findLocationsByStatus", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iolocation_dto_1.CreateIoLocationDto]),
    __metadata("design:returntype", Promise)
], IoLocationController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, iolocation_dto_1.UpdateIoLocationDto]),
    __metadata("design:returntype", Promise)
], IoLocationController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoLocationController.prototype, "deleteLocation", null);
exports.IoLocationController = IoLocationController = __decorate([
    (0, common_1.Controller)('iolocation'),
    __metadata("design:paramtypes", [iolocation_service_1.IoLocationService])
], IoLocationController);
//# sourceMappingURL=iolocation.controller%20copy.js.map