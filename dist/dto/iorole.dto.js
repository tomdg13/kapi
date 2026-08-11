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
exports.UserPermissionErrorResponseDto = exports.UserAccessibleMenusResponseDto = exports.AccessibleMenuDto = exports.SuperAdminCheckResponseDto = exports.AllUserPermissionsResponseDto = exports.UserPermissionDto = exports.UserModulePermissionsResponseDto = exports.UserModuleAccessResponseDto = exports.DeleteRoleResponseDto = exports.RestoreRoleDto = exports.CreateRoleWithPermissionsResponseDto = exports.CreateRoleWithPermissionsDto = exports.MultipleRolePermissionsResponseDto = exports.RolePermissionSummaryDto = exports.BulkOperationResponseDto = exports.BulkAssignPermissionsDto = exports.PermissionValidationResponseDto = exports.ValidatePermissionIdsDto = exports.PermissionErrorResponseDto = exports.UpdatePermissionsResponseDto = exports.RolePermissionsResponseDto = exports.PermissionResponseDto = exports.CopyRolePermissionsDto = exports.RemoveRolePermissionsDto = exports.AddRolePermissionsDto = exports.UpdateRolePermissionsDto = exports.RoleWithUserCountResponseDto = exports.RoleWithUserCountDto = exports.RoleStatsDto = exports.ForbiddenResponseDto = exports.ConflictResponseDto = exports.NotFoundResponseDto = exports.ErrorResponseDto = exports.SuccessResponseDto = exports.SingleRoleResponseDto = exports.RoleListResponseDto = exports.RoleResponseDto = exports.GetRoleByCodeDto = exports.UpdateRoleDto = exports.CreateRoleDto = exports.GetRolesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GetRolesDto {
}
exports.GetRolesDto = GetRolesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['active', 'inactive', 'delete'], {
        message: 'status must be one of: active, inactive, delete',
    }),
    __metadata("design:type", String)
], GetRolesDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'company_id must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'company_id must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'company_id must be an integer' }),
    __metadata("design:type", Number)
], GetRolesDto.prototype, "company_id", void 0);
class CreateRoleDto {
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'role_name is required' }),
    (0, class_validator_1.IsString)({ message: 'role_name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'role_name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'role_name must not exceed 100 characters' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "role_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'role_code is required' }),
    (0, class_validator_1.IsString)({ message: 'role_code must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'role_code must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(50, { message: 'role_code must not exceed 50 characters' }),
    (0, class_validator_1.Matches)(/^[a-z0-9_]+$/, {
        message: 'role_code must contain only lowercase letters, numbers, and underscores',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "role_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'description must be a string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'description must not exceed 500 characters' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim() || null),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'company_id is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'company_id must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'company_id must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'company_id must be an integer' }),
    __metadata("design:type", Number)
], CreateRoleDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'level must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0, { message: 'level must be at least 0' }),
    (0, class_validator_1.Max)(100, { message: 'level must not exceed 100' }),
    (0, class_validator_1.IsInt)({ message: 'level must be an integer' }),
    __metadata("design:type", Number)
], CreateRoleDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateRoleDto.prototype, "permissions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['active', 'inactive'], {
        message: 'status must be either active or inactive',
    }),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'is_system must be a boolean' }),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], CreateRoleDto.prototype, "is_system", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'created_by must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'created_by must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'created_by must be an integer' }),
    __metadata("design:type", Number)
], CreateRoleDto.prototype, "created_by", void 0);
class UpdateRoleDto {
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'role_name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'role_name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'role_name must not exceed 100 characters' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "role_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'description must be a string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'description must not exceed 500 characters' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim() || null),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'level must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0, { message: 'level must be at least 0' }),
    (0, class_validator_1.Max)(100, { message: 'level must not exceed 100' }),
    (0, class_validator_1.IsInt)({ message: 'level must be an integer' }),
    __metadata("design:type", Number)
], UpdateRoleDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateRoleDto.prototype, "permissions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['active', 'inactive'], {
        message: 'status must be either active or inactive',
    }),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'updated_by must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'updated_by must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'updated_by must be an integer' }),
    __metadata("design:type", Number)
], UpdateRoleDto.prototype, "updated_by", void 0);
class GetRoleByCodeDto {
}
exports.GetRoleByCodeDto = GetRoleByCodeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'company_id must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'company_id must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'company_id must be an integer' }),
    __metadata("design:type", Number)
], GetRoleByCodeDto.prototype, "company_id", void 0);
class RoleResponseDto {
}
exports.RoleResponseDto = RoleResponseDto;
class RoleListResponseDto {
}
exports.RoleListResponseDto = RoleListResponseDto;
class SingleRoleResponseDto {
}
exports.SingleRoleResponseDto = SingleRoleResponseDto;
class SuccessResponseDto {
}
exports.SuccessResponseDto = SuccessResponseDto;
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
class NotFoundResponseDto {
}
exports.NotFoundResponseDto = NotFoundResponseDto;
class ConflictResponseDto {
}
exports.ConflictResponseDto = ConflictResponseDto;
class ForbiddenResponseDto {
}
exports.ForbiddenResponseDto = ForbiddenResponseDto;
class RoleStatsDto {
}
exports.RoleStatsDto = RoleStatsDto;
class RoleWithUserCountDto {
}
exports.RoleWithUserCountDto = RoleWithUserCountDto;
class RoleWithUserCountResponseDto {
}
exports.RoleWithUserCountResponseDto = RoleWithUserCountResponseDto;
class UpdateRolePermissionsDto {
}
exports.UpdateRolePermissionsDto = UpdateRolePermissionsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'permission_ids is required' }),
    (0, class_validator_1.IsArray)({ message: 'permission_ids must be an array' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Each permission_id must be an integer' }),
    (0, class_validator_1.ArrayMaxSize)(1000, { message: 'Cannot assign more than 1000 permissions at once' }),
    __metadata("design:type", Array)
], UpdateRolePermissionsDto.prototype, "permission_ids", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'updated_by must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'updated_by must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'updated_by must be an integer' }),
    __metadata("design:type", Number)
], UpdateRolePermissionsDto.prototype, "updated_by", void 0);
class AddRolePermissionsDto {
}
exports.AddRolePermissionsDto = AddRolePermissionsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'permission_ids is required' }),
    (0, class_validator_1.IsArray)({ message: 'permission_ids must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one permission_id is required' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Each permission_id must be an integer' }),
    (0, class_validator_1.ArrayMaxSize)(1000, { message: 'Cannot add more than 1000 permissions at once' }),
    __metadata("design:type", Array)
], AddRolePermissionsDto.prototype, "permission_ids", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'created_by must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'created_by must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'created_by must be an integer' }),
    __metadata("design:type", Number)
], AddRolePermissionsDto.prototype, "created_by", void 0);
class RemoveRolePermissionsDto {
}
exports.RemoveRolePermissionsDto = RemoveRolePermissionsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'permission_ids is required' }),
    (0, class_validator_1.IsArray)({ message: 'permission_ids must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one permission_id is required' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Each permission_id must be an integer' }),
    (0, class_validator_1.ArrayMaxSize)(1000, { message: 'Cannot remove more than 1000 permissions at once' }),
    __metadata("design:type", Array)
], RemoveRolePermissionsDto.prototype, "permission_ids", void 0);
class CopyRolePermissionsDto {
}
exports.CopyRolePermissionsDto = CopyRolePermissionsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'source_role_id is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'source_role_id must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'source_role_id must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'source_role_id must be an integer' }),
    __metadata("design:type", Number)
], CopyRolePermissionsDto.prototype, "source_role_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'replace must be a boolean' }),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], CopyRolePermissionsDto.prototype, "replace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'created_by must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'created_by must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'created_by must be an integer' }),
    __metadata("design:type", Number)
], CopyRolePermissionsDto.prototype, "created_by", void 0);
class PermissionResponseDto {
}
exports.PermissionResponseDto = PermissionResponseDto;
class RolePermissionsResponseDto {
}
exports.RolePermissionsResponseDto = RolePermissionsResponseDto;
class UpdatePermissionsResponseDto {
}
exports.UpdatePermissionsResponseDto = UpdatePermissionsResponseDto;
class PermissionErrorResponseDto {
}
exports.PermissionErrorResponseDto = PermissionErrorResponseDto;
class ValidatePermissionIdsDto {
}
exports.ValidatePermissionIdsDto = ValidatePermissionIdsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'permission_ids is required' }),
    (0, class_validator_1.IsArray)({ message: 'permission_ids must be an array' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Each permission_id must be an integer' }),
    __metadata("design:type", Array)
], ValidatePermissionIdsDto.prototype, "permission_ids", void 0);
class PermissionValidationResponseDto {
}
exports.PermissionValidationResponseDto = PermissionValidationResponseDto;
class BulkAssignPermissionsDto {
}
exports.BulkAssignPermissionsDto = BulkAssignPermissionsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'role_ids is required' }),
    (0, class_validator_1.IsArray)({ message: 'role_ids must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one role_id is required' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Each role_id must be an integer' }),
    (0, class_validator_1.ArrayMaxSize)(100, { message: 'Cannot update more than 100 roles at once' }),
    __metadata("design:type", Array)
], BulkAssignPermissionsDto.prototype, "role_ids", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'permission_ids is required' }),
    (0, class_validator_1.IsArray)({ message: 'permission_ids must be an array' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Each permission_id must be an integer' }),
    (0, class_validator_1.ArrayMaxSize)(1000, { message: 'Cannot assign more than 1000 permissions at once' }),
    __metadata("design:type", Array)
], BulkAssignPermissionsDto.prototype, "permission_ids", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'replace must be a boolean' }),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], BulkAssignPermissionsDto.prototype, "replace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'updated_by must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'updated_by must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'updated_by must be an integer' }),
    __metadata("design:type", Number)
], BulkAssignPermissionsDto.prototype, "updated_by", void 0);
class BulkOperationResponseDto {
}
exports.BulkOperationResponseDto = BulkOperationResponseDto;
class RolePermissionSummaryDto {
}
exports.RolePermissionSummaryDto = RolePermissionSummaryDto;
class MultipleRolePermissionsResponseDto {
}
exports.MultipleRolePermissionsResponseDto = MultipleRolePermissionsResponseDto;
class CreateRoleWithPermissionsDto extends CreateRoleDto {
}
exports.CreateRoleWithPermissionsDto = CreateRoleWithPermissionsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'permission_ids must be an array' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Each permission_id must be an integer' }),
    (0, class_validator_1.ArrayMaxSize)(1000, { message: 'Cannot assign more than 1000 permissions at once' }),
    __metadata("design:type", Array)
], CreateRoleWithPermissionsDto.prototype, "permission_ids", void 0);
class CreateRoleWithPermissionsResponseDto {
}
exports.CreateRoleWithPermissionsResponseDto = CreateRoleWithPermissionsResponseDto;
class RestoreRoleDto {
}
exports.RestoreRoleDto = RestoreRoleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'updated_by must be a number' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1, { message: 'updated_by must be at least 1' }),
    (0, class_validator_1.IsInt)({ message: 'updated_by must be an integer' }),
    __metadata("design:type", Number)
], RestoreRoleDto.prototype, "updated_by", void 0);
class DeleteRoleResponseDto {
}
exports.DeleteRoleResponseDto = DeleteRoleResponseDto;
class UserModuleAccessResponseDto {
}
exports.UserModuleAccessResponseDto = UserModuleAccessResponseDto;
class UserModulePermissionsResponseDto {
}
exports.UserModulePermissionsResponseDto = UserModulePermissionsResponseDto;
class UserPermissionDto {
}
exports.UserPermissionDto = UserPermissionDto;
class AllUserPermissionsResponseDto {
}
exports.AllUserPermissionsResponseDto = AllUserPermissionsResponseDto;
class SuperAdminCheckResponseDto {
}
exports.SuperAdminCheckResponseDto = SuperAdminCheckResponseDto;
class AccessibleMenuDto {
}
exports.AccessibleMenuDto = AccessibleMenuDto;
class UserAccessibleMenusResponseDto {
}
exports.UserAccessibleMenusResponseDto = UserAccessibleMenusResponseDto;
class UserPermissionErrorResponseDto {
}
exports.UserPermissionErrorResponseDto = UserPermissionErrorResponseDto;
//# sourceMappingURL=iorole.dto.js.map