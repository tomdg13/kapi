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
exports.IouserController = exports.ProvinceIdDto = void 0;
const common_1 = require("@nestjs/common");
const iouser_service_1 = require("../service/iouser.service");
const iouser_dto_1 = require("../dto/iouser.dto");
const class_validator_1 = require("class-validator");
class ProvinceIdDto {
}
exports.ProvinceIdDto = ProvinceIdDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProvinceIdDto.prototype, "pr_id", void 0);
let IouserController = class IouserController {
    constructor(iouserService) {
        this.iouserService = iouserService;
    }
    async findById(iouserDto) {
        try {
            return await this.iouserService.findIouserById(iouserDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching iouser by ID',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByRole(iouserDto) {
        try {
            return await this.iouserService.findIousersByRole(iouserDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error fetching iousers by role',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addUser(body) {
        console.log('=== REQUEST ANALYSIS ===');
        console.log('All request keys:', Object.keys(body));
        console.log('Photo field analysis:', {
            'body.photo': typeof body.photo,
            'body.profile_image': typeof body.profile_image,
            'photo_exists': 'photo' in body,
            'profile_image_exists': 'profile_image' in body,
            'photo_value': body.photo ? 'HAS_VALUE' : 'NULL/UNDEFINED',
            'profile_image_value': body.profile_image ? 'HAS_VALUE' : 'NULL/UNDEFINED',
            'photo_length': body.photo?.length || 0,
            'profile_image_length': body.profile_image?.length || 0,
        });
        Object.keys(body).forEach(key => {
            if (key.includes('image') || key.includes('photo')) {
                console.log(`${key}: ${body[key] ? `LENGTH=${body[key].length}` : 'NULL'}`);
            }
            else {
                console.log(`${key}: ${body[key]}`);
            }
        });
        console.log('=== END REQUEST ANALYSIS ===');
        return await this.iouserService.addIouserWithPhoto(body);
    }
    async updateIouser(phone, iouserDto) {
        console.log('🟡 Received PUT /update/:phone request');
        console.log('🆔 phone param:', phone);
        console.log('📦 Request body:', JSON.stringify(iouserDto, null, 2));
        if (!phone || !/^\d+$/.test(phone)) {
            throw new common_1.HttpException('Invalid phone number', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.iouserService.updateIouserWithPhoto(phone, iouserDto);
        console.log('✅ Update result:', result);
        return result;
    }
};
exports.IouserController = IouserController;
__decorate([
    (0, common_1.Post)('iouserId'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iouser_dto_1.IouserDto]),
    __metadata("design:returntype", Promise)
], IouserController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)('iouserRole'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iouser_dto_1.IouserDto]),
    __metadata("design:returntype", Promise)
], IouserController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IouserController.prototype, "addUser", null);
__decorate([
    (0, common_1.Put)('update/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IouserController.prototype, "updateIouser", null);
exports.IouserController = IouserController = __decorate([
    (0, common_1.Controller)('iouser'),
    __metadata("design:paramtypes", [iouser_service_1.iouserService])
], IouserController);
//# sourceMappingURL=iouser.controller.js.map