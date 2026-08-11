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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let BannerService = class BannerService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async updateBannerStatus(id, statusDto) {
        try {
            const { banner_status } = statusDto;
            const sql = `UPDATE kd_banner SET banner_status = ? WHERE banner_id = ?`;
            const values = [banner_status, id];
            await this.dataSource.query(sql, values);
            return {
                status: 'success',
                message: 'Banner status updated successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update banner status',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BannerService);
//# sourceMappingURL=banner.service.js.map