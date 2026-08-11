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
exports.DriverController = void 0;
const common_1 = require("@nestjs/common");
const driver_service_1 = require("../service/driver.service");
const pickup_service_1 = require("../service/pickup.service");
let DriverController = class DriverController {
    constructor(driverService, pickupService) {
        this.driverService = driverService;
        this.pickupService = pickupService;
    }
    async updateDriverStatus(body) {
        return this.driverService.updateDriverOnlineStatus(body.phone, body.online);
    }
    async getNearbyBookings(body) {
        return this.pickupService.findNearbyBookings(body.lat, body.lon);
    }
};
exports.DriverController = DriverController;
__decorate([
    (0, common_1.Put)('status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "updateDriverStatus", null);
__decorate([
    (0, common_1.Post)('nearby'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getNearbyBookings", null);
exports.DriverController = DriverController = __decorate([
    (0, common_1.Controller)('driver'),
    __metadata("design:paramtypes", [driver_service_1.DriverService,
        pickup_service_1.PickupService])
], DriverController);
//# sourceMappingURL=driver.controller.js.map