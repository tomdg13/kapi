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
exports.AdvertisingController = void 0;
const common_1 = require("@nestjs/common");
const advertising_service_1 = require("../service/advertising.service");
const update_advertising_status_dto_1 = require("../dto/update-advertising-status.dto");
const create_advertising_dto_1 = require("../dto/create-advertising.dto");
const public_decorator_1 = require("../auth/public.decorator");
let AdvertisingController = class AdvertisingController {
    constructor(advertisingService) {
        this.advertisingService = advertisingService;
    }
    async getAllAdvertisings() {
        return this.advertisingService.getAllAdvertisings();
    }
    async createAdvertising(createAdvertisingDto) {
        console.log('🚀 Controller received body:', createAdvertisingDto);
        return this.advertisingService.addAdvertisingWithPhoto(createAdvertisingDto);
    }
    async updateAdvertisingStatus(id, statusDto) {
        return this.advertisingService.updateAdvertisingStatus(id, statusDto);
    }
    async updateAdvertising(id, advertisingDto) {
        console.log('🔄 Updating advertising ID:', id, advertisingDto);
        return this.advertisingService.updateAdvertising(id, advertisingDto);
    }
    async deleteAdvertising(id) {
        console.log('🗑️ Deleting advertising ID:', id);
        return this.advertisingService.deleteAdvertising(id);
    }
    async getAllAdvertisingsLegacy() {
        console.log('⚠️ Using deprecated endpoint: POST /advertising/AdvertisingAll');
        return this.advertisingService.getAllAdvertisings();
    }
    async createAdvertisingLegacy(createAdvertisingDto) {
        console.log('⚠️ Using deprecated endpoint: POST /advertising/AddAdvertising');
        console.log('🚀 Controller received body:', createAdvertisingDto);
        return this.advertisingService.addAdvertisingWithPhoto(createAdvertisingDto);
    }
    async updateAdvertisingLegacy(id, advertisingDto) {
        console.log('⚠️ Using deprecated endpoint: PUT /advertising/UpdateAdvertising/:id');
        return this.advertisingService.updateAdvertising(id, advertisingDto);
    }
    async deleteAdvertisingLegacy(id) {
        console.log('⚠️ Using deprecated endpoint: DELETE /advertising/DeleteAdvertising/:id');
        return this.advertisingService.deleteAdvertising(id);
    }
};
exports.AdvertisingController = AdvertisingController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "getAllAdvertisings", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_advertising_dto_1.CreateAdvertisingDto]),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "createAdvertising", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_advertising_status_dto_1.UpdateAdvertisingStatusDto]),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "updateAdvertisingStatus", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_advertising_dto_1.CreateAdvertisingDto]),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "updateAdvertising", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "deleteAdvertising", null);
__decorate([
    (0, common_1.Post)('AdvertisingAll'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "getAllAdvertisingsLegacy", null);
__decorate([
    (0, common_1.Post)('AddAdvertising'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_advertising_dto_1.CreateAdvertisingDto]),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "createAdvertisingLegacy", null);
__decorate([
    (0, common_1.Put)('UpdateAdvertising/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_advertising_dto_1.CreateAdvertisingDto]),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "updateAdvertisingLegacy", null);
__decorate([
    (0, common_1.Delete)('DeleteAdvertising/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdvertisingController.prototype, "deleteAdvertisingLegacy", null);
exports.AdvertisingController = AdvertisingController = __decorate([
    (0, common_1.Controller)('advertising'),
    __metadata("design:paramtypes", [advertising_service_1.AdvertisingService])
], AdvertisingController);
//# sourceMappingURL=advertising.controller.js.map