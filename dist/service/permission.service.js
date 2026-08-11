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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let PermissionService = class PermissionService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getPermissions() {
        try {
            const query = `
        SELECT permission_id, module_name, module_code, description, display_order
        FROM io_permission
        WHERE is_active = 1
        ORDER BY display_order, module_name
      `;
            const permissions = await this.dataSource.query(query);
            return {
                status: 'success',
                message: `Found ${permissions.length} permissions`,
                data: permissions,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ status: 'error', message: 'Failed to fetch permissions', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRolePermissions(roleId) {
        try {
            const query = `
        SELECT 
          p.permission_id,
          p.module_name,
          p.module_code,
          p.description,
          p.display_order,
          COALESCE(rp.can_read, 0) as can_read,
          COALESCE(rp.can_write, 0) as can_write,
          COALESCE(rp.can_approve, 0) as can_approve,
          COALESCE(rp.can_delete, 0) as can_delete,
          COALESCE(rp.access_level, 'none') as access_level,
          rp.custom_permissions
        FROM io_permission p
        LEFT JOIN io_role_permission rp ON p.permission_id = rp.permission_id AND rp.role_id = ?
        WHERE p.is_active = 1
        ORDER BY p.display_order, p.module_name
      `;
            const permissions = await this.dataSource.query(query, [roleId]);
            return {
                status: 'success',
                message: 'Role permissions fetched successfully',
                data: permissions,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ status: 'error', message: 'Failed to fetch role permissions', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRolePermissions(roleId, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const [role] = await queryRunner.query(`SELECT role_id, role_name, is_system FROM io_role WHERE role_id = ?`, [roleId]);
            if (!role) {
                throw new common_1.HttpException('Role not found', common_1.HttpStatus.NOT_FOUND);
            }
            await queryRunner.query(`DELETE FROM io_role_permission WHERE role_id = ?`, [roleId]);
            for (const perm of dto.permissions) {
                const { permission_id, can_read, can_write, can_approve, can_delete, access_level } = perm;
                let finalAccessLevel = access_level;
                if (!finalAccessLevel) {
                    if (can_delete && can_approve && can_write && can_read) {
                        finalAccessLevel = 'full_access';
                    }
                    else if (can_approve && can_read) {
                        finalAccessLevel = 'approve_read';
                    }
                    else if (can_read && can_write) {
                        finalAccessLevel = 'read_write';
                    }
                    else if (can_write && !can_read) {
                        finalAccessLevel = 'write_only';
                    }
                    else if (can_read && !can_write) {
                        finalAccessLevel = 'read_only';
                    }
                    else {
                        finalAccessLevel = 'none';
                    }
                }
                let finalCanRead = can_read;
                let finalCanWrite = can_write;
                let finalCanApprove = can_approve;
                let finalCanDelete = can_delete;
                if (finalAccessLevel === 'full_access') {
                    finalCanRead = true;
                    finalCanWrite = true;
                    finalCanApprove = true;
                    finalCanDelete = true;
                }
                else if (finalAccessLevel === 'approve_read') {
                    finalCanRead = true;
                    finalCanWrite = false;
                    finalCanApprove = true;
                    finalCanDelete = false;
                }
                else if (finalAccessLevel === 'read_write') {
                    finalCanRead = true;
                    finalCanWrite = true;
                    finalCanApprove = false;
                    finalCanDelete = false;
                }
                else if (finalAccessLevel === 'read_only') {
                    finalCanRead = true;
                    finalCanWrite = false;
                    finalCanApprove = false;
                    finalCanDelete = false;
                }
                else if (finalAccessLevel === 'write_only') {
                    finalCanRead = false;
                    finalCanWrite = true;
                    finalCanApprove = false;
                    finalCanDelete = false;
                }
                else {
                    finalCanRead = false;
                    finalCanWrite = false;
                    finalCanApprove = false;
                    finalCanDelete = false;
                }
                const insertQuery = `
          INSERT INTO io_role_permission 
          (role_id, permission_id, can_read, can_write, can_approve, can_delete, access_level)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
                await queryRunner.query(insertQuery, [
                    roleId,
                    permission_id,
                    finalCanRead ? 1 : 0,
                    finalCanWrite ? 1 : 0,
                    finalCanApprove ? 1 : 0,
                    finalCanDelete ? 1 : 0,
                    finalAccessLevel,
                ]);
            }
            await queryRunner.commitTransaction();
            return {
                status: 'success',
                message: 'Role permissions updated successfully',
                data: { role_id: roleId },
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({ status: 'error', message: 'Failed to update role permissions', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateAccessLevels(roleId, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of dto.access_levels) {
                const { permission_id, access_level } = item;
                let can_read = 0, can_write = 0, can_approve = 0, can_delete = 0;
                switch (access_level) {
                    case 'full_access':
                        can_read = 1;
                        can_write = 1;
                        can_approve = 1;
                        can_delete = 1;
                        break;
                    case 'approve_read':
                        can_read = 1;
                        can_approve = 1;
                        break;
                    case 'read_write':
                        can_read = 1;
                        can_write = 1;
                        break;
                    case 'read_only':
                        can_read = 1;
                        break;
                    case 'write_only':
                        can_write = 1;
                        break;
                }
                const upsertQuery = `
          INSERT INTO io_role_permission 
          (role_id, permission_id, can_read, can_write, can_approve, can_delete, access_level)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            can_read = VALUES(can_read),
            can_write = VALUES(can_write),
            can_approve = VALUES(can_approve),
            can_delete = VALUES(can_delete),
            access_level = VALUES(access_level),
            updated_at = NOW()
        `;
                await queryRunner.query(upsertQuery, [
                    roleId, permission_id, can_read, can_write, can_approve, can_delete, access_level,
                ]);
            }
            await queryRunner.commitTransaction();
            return {
                status: 'success',
                message: 'Access levels updated successfully',
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.HttpException({ status: 'error', message: 'Failed to update access levels', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async checkUserPermission(userId, moduleCode, action) {
        try {
            const query = `
        SELECT 
          CASE 
            WHEN ? = 'read' THEN can_read
            WHEN ? = 'write' THEN can_write
            WHEN ? = 'approve' THEN can_approve
            WHEN ? = 'delete' THEN can_delete
            ELSE 0
          END as has_permission
        FROM v_user_permissions
        WHERE user_id = ? AND module_code = ?
        LIMIT 1
      `;
            const result = await this.dataSource.query(query, [
                action, action, action, action, userId, moduleCode,
            ]);
            return result.length > 0 && result[0].has_permission === 1;
        }
        catch (error) {
            console.error('Permission check error:', error);
            return false;
        }
    }
    async getUserPermissions(userId) {
        try {
            const query = `
        SELECT DISTINCT
          module_name,
          module_code,
          can_read,
          can_write,
          can_approve,
          can_delete,
          access_level
        FROM v_user_permissions
        WHERE user_id = ?
        ORDER BY module_name
      `;
            const permissions = await this.dataSource.query(query, [userId]);
            return {
                status: 'success',
                data: permissions,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ status: 'error', message: 'Failed to fetch user permissions', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PermissionService);
//# sourceMappingURL=permission.service.js.map