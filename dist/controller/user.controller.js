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
exports.UserController = exports.ProvinceIdDto = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("../dto/user.dto");
const user_service_1 = require("../service/user.service");
const user_dto_2 = require("../dto/user.dto");
const class_validator_1 = require("class-validator");
const village_id_dto_1 = require("../auth/dto/village-id.dto");
class ProvinceIdDto {
}
exports.ProvinceIdDto = ProvinceIdDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProvinceIdDto.prototype, "pr_id", void 0);
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async findById(userDto) {
        try {
            return await this.userService.findUserById(userDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching user by ID',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByRole(userDto) {
        try {
            return await this.userService.findUsersByRole(userDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching users by role',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllcartype() {
        try {
            return await this.userService.findAllcartype();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching banks',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllCustomer() {
        try {
            return await this.userService.findAllCustomer();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching banks',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllDriver() {
        try {
            return await this.userService.findAllDriver();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching banks',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateDriver(phone, driverDto) {
        console.log('🟡 Received PUT /updateDriver/:phone request');
        console.log('🆔 phone param:', phone);
        console.log('📦 Request body:', JSON.stringify(driverDto, null, 2));
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.userService.updateDriver(phone, driverDto);
            console.log('✅ Update result:', result);
            return result;
        }
        catch (error) {
            console.error('❌ Error in updateDriver:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Failed to update driver',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDriverByPhone(body) {
        return this.userService.findDriverByPhone(body.phone);
    }
    async getCustomerByPhone(body) {
        return this.userService.findCustomerByPhone(body.phone);
    }
    async getAllBanks() {
        try {
            return await this.userService.findAllBanks();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching banks',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllProvinces() {
        try {
            return await this.userService.findAllProvinces();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching provinces',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDistrictsByProvince(body) {
        try {
            return await this.userService.findDistrictsByProvinceId(body.pr_id);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching districts',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getVillages(villageDto) {
        try {
            return await this.userService.findVillagesByDistrict(villageDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching villages',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addUser(body) {
        try {
            return await this.userService.addUserWithPhoto(body);
        }
        catch (error) {
            console.error('addUser error:', error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create user',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUser(phone, userDto) {
        console.log('🟡 Received PUT /update/:phone request');
        console.log('🆔 phone param:', phone);
        console.log('📦 Request body:', JSON.stringify(userDto, null, 2));
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.userService.updateUserWithPhoto(phone, userDto);
        console.log('✅ Update result:', result);
        return result;
    }
    async updateCustomer(phone, userDto) {
        console.log('🟡 Received PUT /updateCustomer/:phone request');
        console.log('🆔 phone param:', phone);
        console.log('📦 Request body:', JSON.stringify(userDto, null, 2));
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.userService.updateCustomer(phone, userDto);
            console.log('✅ Update result:', result);
            return result;
        }
        catch (error) {
            console.error('❌ Error in updateCustomer:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Failed to update customer',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadProfileImage(dto) {
        return this.userService.addProfileImage(dto);
    }
    async getProfileImage(dto) {
        return this.userService.getProfileImageByCustomerId(dto);
    }
    async getDriverProfile(body) {
        return this.userService.getProfiledriver(body);
    }
    async getParameter(body) {
        return this.userService.getParameter(body);
    }
    async getAllParameters() {
        return this.userService.getAllParameters();
    }
    async updateParameter(body) {
        return this.userService.updateParameter(body);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('userId'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_2.UserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)('userRole'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_2.UserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Get)('carType'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllcartype", null);
__decorate([
    (0, common_1.Get)('customerkyc'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllCustomer", null);
__decorate([
    (0, common_1.Get)('Driverkyc'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllDriver", null);
__decorate([
    (0, common_1.Put)('updateDriver/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateDriver", null);
__decorate([
    (0, common_1.Post)('Driverkyc'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDriverByPhone", null);
__decorate([
    (0, common_1.Post)('Customerkyc'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCustomerByPhone", null);
__decorate([
    (0, common_1.Get)('bank'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllBanks", null);
__decorate([
    (0, common_1.Get)('province'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllProvinces", null);
__decorate([
    (0, common_1.Post)('district'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProvinceIdDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDistrictsByProvince", null);
__decorate([
    (0, common_1.Post)('villages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [village_id_dto_1.VillageIdDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getVillages", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addUser", null);
__decorate([
    (0, common_1.Put)('update/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)('updateCustomer/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Post)('uploadProfile'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.ProfileImageDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadProfileImage", null);
__decorate([
    (0, common_1.Post)('getProfileImage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfileImage", null);
__decorate([
    (0, common_1.Post)('getProfiledriver'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDriverProfile", null);
__decorate([
    (0, common_1.Post)('getParameter'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getParameter", null);
__decorate([
    (0, common_1.Post)('getAllParameters'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllParameters", null);
__decorate([
    (0, common_1.Post)('updateParameter'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateParameter", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.userService])
], UserController);
//# sourceMappingURL=user.controller.js.map