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
exports.IoGroupController = void 0;
const common_1 = require("@nestjs/common");
const iogroup_service_1 = require("../service/iogroup.service");
const iogroup_dto_1 = require("../dto/iogroup.dto");
let IoGroupController = class IoGroupController {
    constructor(ioGroupService) {
        this.ioGroupService = ioGroupService;
    }
    async findGroupById(id) {
        try {
            const dto = { id };
            return await this.ioGroupService.findGroupById(dto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch group',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findGroupsByStatus(query) {
        try {
            return await this.ioGroupService.findGroupsByStatus(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch groups',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createGroup(createGroupDto) {
        try {
            return await this.ioGroupService.addGroupWithImage(createGroupDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create group',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateGroup(id, updateGroupDto) {
        try {
            return await this.ioGroupService.updateGroupWithImage(id, updateGroupDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update group',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteGroup(id) {
        try {
            return await this.ioGroupService.deleteGroup(id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete group',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoGroupController = IoGroupController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoGroupController.prototype, "findGroupById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iogroup_dto_1.IogroupDto]),
    __metadata("design:returntype", Promise)
], IoGroupController.prototype, "findGroupsByStatus", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [iogroup_dto_1.CreateIogroupDto]),
    __metadata("design:returntype", Promise)
], IoGroupController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, iogroup_dto_1.UpdateIogroupDto]),
    __metadata("design:returntype", Promise)
], IoGroupController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoGroupController.prototype, "deleteGroup", null);
exports.IoGroupController = IoGroupController = __decorate([
    (0, common_1.Controller)('iogroup'),
    __metadata("design:paramtypes", [iogroup_service_1.IoGroupService])
], IoGroupController);
//# sourceMappingURL=iogroup.controller.js.map