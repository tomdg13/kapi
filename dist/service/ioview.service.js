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
exports.IoViewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let IoViewService = class IoViewService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findLocations(dto) {
        try {
            const query = `SELECT * FROM iov_location WHERE company_id = ?`;
            const params = [dto.company_id];
            const result = await this.dataSource.query(query, params);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const locationsWithImageUrls = result.map((location) => ({
                ...location,
                image_url: location.image ? imageBaseUrl + location.image : null,
            }));
            return {
                status: 'success',
                message: `Locations fetched for company ${dto.company_id}`,
                data: locationsWithImageUrls,
            };
        }
        catch (error) {
            console.error('Error fetching locations:', error);
            return {
                status: 'error',
                message: 'Failed to fetch locations',
                error: error.message,
            };
        }
    }
    async findProducts(dto) {
        try {
            console.log('🔍 [findProducts] Request DTO:', JSON.stringify(dto, null, 2));
            const query = `SELECT * FROM iov_product WHERE company_id = ?`;
            const params = [dto.company_id];
            console.log('🗄️ [findProducts] Executing query:', query);
            console.log('📝 [findProducts] Query params:', params);
            const result = await this.dataSource.query(query, params);
            console.log(`📊 [findProducts] Query result count: ${result.length}`);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/ioproduct/`;
            const productsWithImageUrls = result.map((product) => ({
                ...product,
                image_url: product.image ? imageBaseUrl + product.image : null,
            }));
            console.log('✅ [findProducts] Success response prepared');
            return {
                status: 'success',
                message: `Products fetched for company ${dto.company_id}`,
                data: productsWithImageUrls,
            };
        }
        catch (error) {
            console.error('❌ [findProducts] Error:', error);
            return {
                status: 'error',
                message: 'Failed to fetch products',
                error: error.message,
            };
        }
    }
    async findTerminals(dto) {
        try {
            console.log('🔍 [findTerminals] Request DTO:', JSON.stringify(dto, null, 2));
            const query = `SELECT * FROM iov_terminal WHERE company_id = ?`;
            const params = [dto.company_id];
            console.log('🗄️ [findTerminals] Executing query:', query);
            console.log('📝 [findTerminals] Query params:', params);
            const result = await this.dataSource.query(query, params);
            console.log(`📊 [findTerminals] Query result count: ${result.length}`);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/ioterminal/`;
            const terminalsWithImageUrls = result.map((terminal) => ({
                ...terminal,
                image_url: terminal.image ? imageBaseUrl + terminal.image : null,
            }));
            console.log('✅ [findTerminals] Success response prepared');
            return {
                status: 'success',
                message: `Terminals fetched for company ${dto.company_id}`,
                data: terminalsWithImageUrls,
            };
        }
        catch (error) {
            console.error('❌ [findTerminals] Error:', error);
            return {
                status: 'error',
                message: 'Failed to fetch terminals',
                error: error.message,
            };
        }
    }
};
exports.IoViewService = IoViewService;
exports.IoViewService = IoViewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IoViewService);
//# sourceMappingURL=ioview.service.js.map