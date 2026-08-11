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
exports.IoroleController = void 0;
const common_1 = require("@nestjs/common");
const iorole_service_1 = require("../service/iorole.service");
let IoroleController = class IoroleController {
    constructor(ioroleService) {
        this.ioroleService = ioroleService;
        console.log('✅ IoroleController initialized');
        console.log('   Base Route: /api/iorole');
        console.log('   📋 Role Management:');
        console.log('      GET    /api/iorole');
        console.log('      GET    /api/iorole/with-user-count');
        console.log('      GET    /api/iorole/code/:code');
        console.log('      GET    /api/iorole/:id');
        console.log('      POST   /api/iorole');
        console.log('      PUT    /api/iorole/:id');
        console.log('      DELETE /api/iorole/:id');
        console.log('      DELETE /api/iorole/:id/hard');
        console.log('      POST   /api/iorole/:id/restore');
        console.log('   🔐 Permission Mapping:');
        console.log('      GET    /api/iorole/:id/permissions');
        console.log('      PUT    /api/iorole/:id/permissions');
        console.log('      POST   /api/iorole/:id/permissions/add');
        console.log('      POST   /api/iorole/:id/permissions/remove');
        console.log('      POST   /api/iorole/:id/permissions/copy');
        console.log('   👤 User Permission Checks:');
        console.log('      GET    /api/iorole/user/:user_id/check/:module_code');
        console.log('      GET    /api/iorole/user/:user_id/module/:module_code');
        console.log('      GET    /api/iorole/user/:user_id/all-permissions');
        console.log('      GET    /api/iorole/user/:user_id/is-super-admin');
        console.log('      GET    /api/iorole/user/:user_id/accessible-menus');
    }
    async getRoles(status, company_id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole - Get Roles');
        console.log('   Query Parameters:');
        console.log('   - status:', status || 'all');
        console.log('   - company_id:', company_id || 'all');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const companyIdNum = company_id ? parseInt(company_id) : undefined;
            if (company_id && isNaN(companyIdNum)) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'company_id must be a valid number',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.ioroleService.getRoles(status, companyIdNum);
            console.log('✅ Success - Found', result.data?.length || 0, 'roles');
            return result;
        }
        catch (error) {
            console.error('❌ Error in getRoles controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch roles',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRolesWithUserCount(company_id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/with-user-count - Get Roles With User Count');
        console.log('   Query Parameters:');
        console.log('   - company_id:', company_id || 'all');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const companyIdNum = company_id ? parseInt(company_id) : undefined;
            if (company_id && isNaN(companyIdNum)) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'company_id must be a valid number',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.ioroleService.getRolesWithUserCount(companyIdNum);
            console.log('✅ Success - Found', result.data?.length || 0, 'roles with user counts');
            return result;
        }
        catch (error) {
            console.error('❌ Error in getRolesWithUserCount controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch roles with user count',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRoleByCode(code, company_id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/code/:code - Get Role by Code');
        console.log('   Role Code:', code);
        console.log('   Company ID:', company_id || 'all');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const companyIdNum = company_id ? parseInt(company_id) : undefined;
            if (company_id && isNaN(companyIdNum)) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'company_id must be a valid number',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.ioroleService.getRoleByCode(code, companyIdNum);
            if (result.status === 'not_found') {
                console.log('⚠️  Role not found');
                throw new common_1.HttpException(result, common_1.HttpStatus.NOT_FOUND);
            }
            console.log('✅ Success - Role found:', result.data?.role_name);
            return result;
        }
        catch (error) {
            console.error('❌ Error in getRoleByCode controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch role by code',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRoleById(id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/:id - Get Role by ID');
        console.log('   Role ID:', id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.getRoleById(id);
            if (result.status === 'not_found') {
                console.log('⚠️  Role not found');
                throw new common_1.HttpException(result, common_1.HttpStatus.NOT_FOUND);
            }
            console.log('✅ Success - Role found:', result.data?.role_name);
            return result;
        }
        catch (error) {
            console.error('❌ Error in getRoleById controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch role',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createRole(roleData) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 POST /api/iorole - Create Role');
        console.log('   Request Body:', JSON.stringify(roleData, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        const errors = [];
        if (!roleData.role_name) {
            errors.push('role_name is required');
        }
        if (!roleData.role_code) {
            errors.push('role_code is required');
        }
        if (!roleData.company_id) {
            errors.push('company_id is required');
        }
        if (roleData.company_id && typeof roleData.company_id !== 'number') {
            errors.push('company_id must be a number');
        }
        if (errors.length > 0) {
            console.log('❌ Validation Errors:', errors);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Validation failed',
                errors: errors,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.ioroleService.createRole(roleData);
            console.log('✅ Success - Role created:', roleData.role_name);
            return result;
        }
        catch (error) {
            console.error('❌ Error in createRole controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create role',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRole(id, roleData) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 PUT /api/iorole/:id - Update Role');
        console.log('   Role ID:', id);
        console.log('   Request Body:', JSON.stringify(roleData, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (!roleData || Object.keys(roleData).length === 0) {
            console.log('❌ Validation Error: Request body is empty');
            throw new common_1.HttpException({
                status: 'error',
                message: 'Request body cannot be empty',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.ioroleService.updateRole(id, roleData);
            console.log('✅ Success - Role updated');
            return result;
        }
        catch (error) {
            console.error('❌ Error in updateRole controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update role',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteRole(id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 DELETE /api/iorole/:id - Delete Role (Soft)');
        console.log('   Role ID:', id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.deleteRole(id);
            console.log('✅ Success - Role deleted (soft delete)');
            return result;
        }
        catch (error) {
            console.error('❌ Error in deleteRole controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete role',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async hardDeleteRole(id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  DELETE /api/iorole/:id/hard - HARD DELETE Role');
        console.log('   Role ID:', id);
        console.log('   ⚠️  WARNING: This will permanently delete the role!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.hardDeleteRole(id);
            console.log('✅ Success - Role permanently deleted');
            return result;
        }
        catch (error) {
            console.error('❌ Error in hardDeleteRole controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to hard delete role',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async restoreRole(id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 POST /api/iorole/:id/restore - Restore Role');
        console.log('   Role ID:', id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.restoreRole(id);
            console.log('✅ Success - Role restored');
            return result;
        }
        catch (error) {
            console.error('❌ Error in restoreRole controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to restore role',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRolePermissions(id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/:id/permissions - Get Role Permissions');
        console.log('   Role ID:', id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.getRolePermissions(id);
            console.log('✅ Success - Found', result.data?.length || 0, 'permissions');
            return result;
        }
        catch (error) {
            console.error('❌ Error in getRolePermissions controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch role permissions',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRolePermissions(id, body) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 PUT /api/iorole/:id/permissions - Update Role Permissions');
        console.log('   Role ID:', id);
        console.log('   Permission IDs:', JSON.stringify(body.permission_ids));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (body.permission_ids === undefined || body.permission_ids === null) {
            console.log('❌ Validation Error: permission_ids is required');
            throw new common_1.HttpException({
                status: 'error',
                message: 'permission_ids is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!Array.isArray(body.permission_ids)) {
            console.log('❌ Validation Error: permission_ids must be an array');
            throw new common_1.HttpException({
                status: 'error',
                message: 'permission_ids must be an array',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.ioroleService.updateRolePermissions(id, body.permission_ids);
            console.log('✅ Success - Permissions updated');
            return result;
        }
        catch (error) {
            console.error('❌ Error in updateRolePermissions controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update role permissions',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addPermissionsToRole(id, body) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 POST /api/iorole/:id/permissions/add - Add Permissions');
        console.log('   Role ID:', id);
        console.log('   Permission IDs to add:', JSON.stringify(body.permission_ids));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (!body.permission_ids) {
            console.log('❌ Validation Error: permission_ids is required');
            throw new common_1.HttpException({
                status: 'error',
                message: 'permission_ids is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!Array.isArray(body.permission_ids)) {
            console.log('❌ Validation Error: permission_ids must be an array');
            throw new common_1.HttpException({
                status: 'error',
                message: 'permission_ids must be an array',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (body.permission_ids.length === 0) {
            console.log('⚠️  Warning: Empty permission_ids array');
            return {
                status: 'success',
                message: 'No permissions to add',
                data: { role_id: id, added_count: 0 },
            };
        }
        try {
            const result = await this.ioroleService.addPermissionsToRole(id, body.permission_ids);
            console.log('✅ Success - Permissions added');
            return result;
        }
        catch (error) {
            console.error('❌ Error in addPermissionsToRole controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to add permissions to role',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removePermissionsFromRole(id, body) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 POST /api/iorole/:id/permissions/remove - Remove Permissions');
        console.log('   Role ID:', id);
        console.log('   Permission IDs to remove:', JSON.stringify(body.permission_ids));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (!body.permission_ids) {
            console.log('❌ Validation Error: permission_ids is required');
            throw new common_1.HttpException({
                status: 'error',
                message: 'permission_ids is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!Array.isArray(body.permission_ids)) {
            console.log('❌ Validation Error: permission_ids must be an array');
            throw new common_1.HttpException({
                status: 'error',
                message: 'permission_ids must be an array',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (body.permission_ids.length === 0) {
            console.log('⚠️  Warning: Empty permission_ids array');
            return {
                status: 'success',
                message: 'No permissions to remove',
                data: { role_id: id, removed_count: 0 },
            };
        }
        try {
            const result = await this.ioroleService.removePermissionsFromRole(id, body.permission_ids);
            console.log('✅ Success - Permissions removed');
            return result;
        }
        catch (error) {
            console.error('❌ Error in removePermissionsFromRole controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to remove permissions from role',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async copyRolePermissions(target_role_id, body) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 POST /api/iorole/:id/permissions/copy - Copy Permissions');
        console.log('   Target Role ID:', target_role_id);
        console.log('   Source Role ID:', body.source_role_id);
        console.log('   Replace existing:', body.replace !== undefined ? body.replace : false);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (!body.source_role_id) {
            console.log('❌ Validation Error: source_role_id is required');
            throw new common_1.HttpException({
                status: 'error',
                message: 'source_role_id is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (typeof body.source_role_id !== 'number') {
            console.log('❌ Validation Error: source_role_id must be a number');
            throw new common_1.HttpException({
                status: 'error',
                message: 'source_role_id must be a number',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (body.source_role_id === target_role_id) {
            console.log('❌ Validation Error: Cannot copy from the same role');
            throw new common_1.HttpException({
                status: 'error',
                message: 'Cannot copy permissions to the same role',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const replace = body.replace !== undefined ? body.replace : false;
            const result = await this.ioroleService.copyRolePermissions(body.source_role_id, target_role_id, replace);
            console.log('✅ Success - Permissions copied');
            return result;
        }
        catch (error) {
            console.error('❌ Error in copyRolePermissions controller:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to copy role permissions',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkUserModuleAccess(user_id, module_code) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/user/:user_id/check/:module_code');
        console.log('   User ID:', user_id);
        console.log('   Module Code:', module_code);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.checkUserModuleAccess(user_id, module_code);
            console.log('✅ Access check completed:', result.hasAccess ? 'GRANTED' : 'DENIED');
            return result;
        }
        catch (error) {
            console.error('❌ Error checking user module access:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to check module access',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserModulePermissions(user_id, module_code) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/user/:user_id/module/:module_code');
        console.log('   User ID:', user_id);
        console.log('   Module Code:', module_code);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.getUserModulePermissions(user_id, module_code);
            console.log('✅ Permissions retrieved');
            return result;
        }
        catch (error) {
            console.error('❌ Error getting user module permissions:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to get module permissions',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllUserPermissions(user_id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/user/:user_id/all-permissions');
        console.log('   User ID:', user_id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.getAllUserPermissions(user_id);
            console.log('✅ All permissions retrieved:', result.permissions?.length || 0);
            return result;
        }
        catch (error) {
            console.error('❌ Error getting all user permissions:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to get user permissions',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkIsSuperAdmin(user_id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/user/:user_id/is-super-admin');
        console.log('   User ID:', user_id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.checkIsSuperAdmin(user_id);
            console.log('✅ Super Admin check:', result.isSuperAdmin ? 'YES' : 'NO');
            return result;
        }
        catch (error) {
            console.error('❌ Error checking Super Admin status:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to check Super Admin status',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserAccessibleMenus(user_id) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 GET /api/iorole/user/:user_id/accessible-menus');
        console.log('   User ID:', user_id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const result = await this.ioroleService.getUserAccessibleMenus(user_id);
            console.log('✅ Accessible menus retrieved:', result.menus?.length || 0);
            return result;
        }
        catch (error) {
            console.error('❌ Error getting accessible menus:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to get accessible menus',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoroleController = IoroleController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('company_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)('with-user-count'),
    __param(0, (0, common_1.Query)('company_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "getRolesWithUserCount", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Query)('company_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "getRoleByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "getRoleById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "createRole", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "hardDeleteRole", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "restoreRole", null);
__decorate([
    (0, common_1.Get)(':id/permissions'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "getRolePermissions", null);
__decorate([
    (0, common_1.Put)(':id/permissions'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "updateRolePermissions", null);
__decorate([
    (0, common_1.Post)(':id/permissions/add'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "addPermissionsToRole", null);
__decorate([
    (0, common_1.Post)(':id/permissions/remove'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "removePermissionsFromRole", null);
__decorate([
    (0, common_1.Post)(':id/permissions/copy'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "copyRolePermissions", null);
__decorate([
    (0, common_1.Get)('user/:user_id/check/:module_code'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('module_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "checkUserModuleAccess", null);
__decorate([
    (0, common_1.Get)('user/:user_id/module/:module_code'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('module_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "getUserModulePermissions", null);
__decorate([
    (0, common_1.Get)('user/:user_id/all-permissions'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "getAllUserPermissions", null);
__decorate([
    (0, common_1.Get)('user/:user_id/is-super-admin'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "checkIsSuperAdmin", null);
__decorate([
    (0, common_1.Get)('user/:user_id/accessible-menus'),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IoroleController.prototype, "getUserAccessibleMenus", null);
exports.IoroleController = IoroleController = __decorate([
    (0, common_1.Controller)('iorole'),
    __metadata("design:paramtypes", [iorole_service_1.IoroleService])
], IoroleController);
//# sourceMappingURL=iorole.controller.js.map