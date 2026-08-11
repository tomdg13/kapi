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
exports.userService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let userService = class userService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findUserById(dto) {
        try {
            const query = `SELECT * FROM kd_user WHERE user_id = ?`;
            const result = await this.dataSource.query(query, [dto.id]);
            if (result.length === 0) {
                return {
                    status: 'not_found',
                    message: `User with ID ${dto.id} not found`,
                    data: [],
                };
            }
            return {
                status: 'success',
                message: 'User fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching user:', error);
            return {
                status: 'error',
                message: 'Failed to fetch user info',
                error: error.message,
            };
        }
    }
    async findUsersByRole(dto) {
        try {
            let query;
            let params = [];
            if (dto.role.toLowerCase() === 'admin') {
                query = `SELECT * FROM kd_user`;
            }
            else {
                query = `SELECT * FROM kd_user WHERE role = ?`;
                params.push(dto.role);
            }
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: dto.role.toLowerCase() === 'admin' ? 'All users fetched' : `Users with role ${dto.role} fetched`,
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching users by role:', error);
            return {
                status: 'error',
                message: 'Failed to fetch users',
                error: error.message,
            };
        }
    }
    async findAllBanks() {
        try {
            const query = `SELECT * FROM kd_bank`;
            const result = await this.dataSource.query(query);
            return {
                status: 'success',
                message: 'Banks fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching banks:', error);
            return {
                status: 'error',
                message: 'Failed to fetch banks',
                error: error.message,
            };
        }
    }
    async findAllProvinces() {
        try {
            const result = await this.dataSource.query('SELECT * FROM kd_province');
            return {
                status: 'success',
                message: 'Provinces fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching provinces:', error);
            return {
                status: 'error',
                message: 'Failed to fetch provinces',
                error: error.message,
            };
        }
    }
    async findDistrictsByProvinceId(pr_id) {
        try {
            const result = await this.dataSource.query('SELECT * FROM kd_district WHERE pr_id = ?', [pr_id]);
            return {
                status: 'success',
                message: 'Districts fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching districts:', error);
            return {
                status: 'error',
                message: 'Failed to fetch districts',
                error: error.message,
            };
        }
    }
    async findVillagesByDistrict(dto) {
        try {
            const query = `
      SELECT * FROM kd_village
      WHERE dr_id = ? AND dr_id IN (
        SELECT dr_id FROM kd_district WHERE pr_id = ?
      )`;
            const result = await this.dataSource.query(query, [dto.dr_id, dto.pr_id]);
            return {
                status: 'success',
                message: 'Villages fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching villages:', error);
            return {
                status: 'error',
                message: 'Failed to fetch villages',
                error: error.message,
            };
        }
    }
};
exports.userService = userService;
exports.userService = userService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], userService);
//# sourceMappingURL=user.service%20a%20copy.js.map