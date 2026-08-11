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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let DriverService = class DriverService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async updateDriverOnlineStatus(phone, onlineStatus) {
        try {
            if (!['Online', 'Offline'].includes(onlineStatus)) {
                throw new Error('Invalid status value. Must be Online or Offline');
            }
            const result = await this.dataSource.query(`UPDATE kd_driver SET Online = ? WHERE phone = ?`, [onlineStatus, phone]);
            if (result.affectedRows === 0 || result.affected === 0) {
                throw new Error('Driver not found or no change');
            }
            return {
                status: 'success',
                message: `Driver Online updated to ${onlineStatus}`,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update driver Online',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DriverService);
//# sourceMappingURL=driver.service.js.map