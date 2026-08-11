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
exports.IoProductController = void 0;
const common_1 = require("@nestjs/common");
const ioproduct_service_1 = require("../service/ioproduct.service");
const ioproduct_dto_1 = require("../dto/ioproduct.dto");
let IoProductController = class IoProductController {
    constructor(ioProductService) {
        this.ioProductService = ioProductService;
    }
    async findProductByBarcode(barcode) {
        try {
            console.log(`🔍 DEBUG: Searching for product with barcode: ${barcode}`);
            const result = await this.ioProductService.findProductByBarcode(barcode);
            if (result.status === 'not_found') {
                throw new common_1.HttpException({
                    status: 'not_found',
                    message: result.message,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return result;
        }
        catch (error) {
            console.error('❌ DEBUG: Error in barcode search controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to search product by barcode',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findProductById(id) {
        try {
            const dto = { id };
            return await this.ioProductService.findProductById(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch product',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findProductsByStatus(query) {
        try {
            return await this.ioProductService.findProductsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch products',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createProduct(createProductDto) {
        try {
            return await this.ioProductService.addProductWithImage(createProductDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create product',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProduct(id, updateProductDto) {
        try {
            return await this.ioProductService.updateProductWithImage(id, updateProductDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update product',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteProduct(id) {
        try {
            return await this.ioProductService.deleteProduct(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete product',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoProductController = IoProductController;
__decorate([
    (0, common_1.Get)('barcode/:barcode'),
    __param(0, (0, common_1.Param)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IoProductController.prototype, "findProductByBarcode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoProductController.prototype, "findProductById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ioproduct_dto_1.IoProductDto]),
    __metadata("design:returntype", Promise)
], IoProductController.prototype, "findProductsByStatus", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ioproduct_dto_1.CreateIoProductDto]),
    __metadata("design:returntype", Promise)
], IoProductController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ioproduct_dto_1.UpdateIoProductDto]),
    __metadata("design:returntype", Promise)
], IoProductController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoProductController.prototype, "deleteProduct", null);
exports.IoProductController = IoProductController = __decorate([
    (0, common_1.Controller)('ioproduct'),
    __metadata("design:paramtypes", [ioproduct_service_1.IoProductService])
], IoProductController);
//# sourceMappingURL=ioproduct.controller.js.map