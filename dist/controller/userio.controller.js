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
exports.UserioController = void 0;
const common_1 = require("@nestjs/common");
const userio_service_1 = require("../service/userio.service");
const userio_dto_1 = require("../dto/userio.dto");
let UserioController = class UserioController {
    constructor(userioService) {
        this.userioService = userioService;
    }
    async findById(userioDto) {
        try {
            if (!userioDto.id) {
                throw new common_1.HttpException('Userio ID is required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.userioService.findUserioById(userioDto);
        }
        catch (error) {
            console.error('❌ findById error:', error);
            throw new common_1.HttpException({
                status: 'error',
                error: 'Error fetching userio by ID',
                message: error.message,
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByRole(userioDto) {
        try {
            if (!userioDto.role) {
                throw new common_1.HttpException('Role is required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.userioService.findUseriosByRole(userioDto);
        }
        catch (error) {
            console.error('❌ findByRole error:', error);
            throw new common_1.HttpException({
                status: 'error',
                error: 'Error fetching userios by role',
                message: error.message,
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addUserio(createUserioDto) {
        try {
            console.log('🟢 Received POST /add request');
            console.log('📦 Request body keys:', Object.keys(createUserioDto));
            return await this.userioService.addUserioWithPhoto(createUserioDto);
        }
        catch (error) {
            console.error('❌ addUserio error:', error);
            if (error.status === common_1.HttpStatus.CONFLICT) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create userio',
                error: error.message,
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUserio(phone, updateUserioDto) {
        try {
            console.log('🟡 Received PUT /update/:phone request');
            console.log('🆔 phone param:', phone);
            console.log('📦 Request body keys:', Object.keys(updateUserioDto));
            if (!phone || !/^\d{8,15}$/.test(phone)) {
                throw new common_1.HttpException('Invalid phone number format. Must be 8-15 digits.', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.userioService.updateUserioWithPhoto(phone, updateUserioDto);
            console.log('✅ Update result:', result);
            return result;
        }
        catch (error) {
            console.error('❌ updateUserio error:', error);
            if (error.status === common_1.HttpStatus.NOT_FOUND || error.status === common_1.HttpStatus.CONFLICT) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update userio',
                error: error.message,
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteUserio(phone) {
        try {
            console.log('🔴 Received DELETE /delete/:phone request');
            console.log('🆔 phone param:', phone);
            if (!phone || !/^\d{8,15}$/.test(phone)) {
                throw new common_1.HttpException('Invalid phone number format. Must be 8-15 digits.', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.userioService.deleteUserio(phone);
            console.log('✅ Delete result:', result);
            return result;
        }
        catch (error) {
            console.error('❌ deleteUserio error:', error);
            if (error.status === common_1.HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete userio',
                error: error.message,
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async healthCheck() {
        return {
            status: 'success',
            message: 'Userio service is running',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.UserioController = UserioController;
__decorate([
    (0, common_1.Post)('userioId'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userio_dto_1.UserioDto]),
    __metadata("design:returntype", Promise)
], UserioController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)('userioRole'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userio_dto_1.UserioDto]),
    __metadata("design:returntype", Promise)
], UserioController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userio_dto_1.CreateUserioDto]),
    __metadata("design:returntype", Promise)
], UserioController.prototype, "addUserio", null);
__decorate([
    (0, common_1.Put)('update/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, userio_dto_1.UpdateUserioDto]),
    __metadata("design:returntype", Promise)
], UserioController.prototype, "updateUserio", null);
__decorate([
    (0, common_1.Delete)('delete/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserioController.prototype, "deleteUserio", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserioController.prototype, "healthCheck", null);
exports.UserioController = UserioController = __decorate([
    (0, common_1.Controller)('userio'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [userio_service_1.userioService])
], UserioController);
//# sourceMappingURL=userio.controller.js.map