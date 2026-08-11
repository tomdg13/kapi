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
exports.BulkAccessLevelDto = exports.AccessLevelDto = exports.CheckPermissionDto = exports.UpdateRolePermissionsDto = exports.RolePermissionDto = exports.PermissionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PermissionDto {
}
exports.PermissionDto = PermissionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PermissionDto.prototype, "permission_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PermissionDto.prototype, "module_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PermissionDto.prototype, "module_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PermissionDto.prototype, "description", void 0);
class RolePermissionDto {
}
exports.RolePermissionDto = RolePermissionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], RolePermissionDto.prototype, "permission_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 1 || value === 'true'),
    __metadata("design:type", Boolean)
], RolePermissionDto.prototype, "can_read", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 1 || value === 'true'),
    __metadata("design:type", Boolean)
], RolePermissionDto.prototype, "can_write", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 1 || value === 'true'),
    __metadata("design:type", Boolean)
], RolePermissionDto.prototype, "can_approve", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 1 || value === 'true'),
    __metadata("design:type", Boolean)
], RolePermissionDto.prototype, "can_delete", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['none', 'read_only', 'write_only', 'read_write', 'approve_read', 'full_access']),
    __metadata("design:type", String)
], RolePermissionDto.prototype, "access_level", void 0);
class UpdateRolePermissionsDto {
}
exports.UpdateRolePermissionsDto = UpdateRolePermissionsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateRolePermissionsDto.prototype, "permissions", void 0);
class CheckPermissionDto {
}
exports.CheckPermissionDto = CheckPermissionDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckPermissionDto.prototype, "module_code", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['read', 'write', 'approve', 'delete']),
    __metadata("design:type", String)
], CheckPermissionDto.prototype, "action", void 0);
class AccessLevelDto {
}
exports.AccessLevelDto = AccessLevelDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AccessLevelDto.prototype, "permission_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['none', 'read_only', 'write_only', 'read_write', 'approve_read', 'full_access']),
    __metadata("design:type", String)
], AccessLevelDto.prototype, "access_level", void 0);
class BulkAccessLevelDto {
}
exports.BulkAccessLevelDto = BulkAccessLevelDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], BulkAccessLevelDto.prototype, "access_levels", void 0);
//# sourceMappingURL=permission.dto.js.map