import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from '../dto/iorole.dto';

@Injectable()
export class IoroleService {
  constructor(private dataSource: DataSource) {
    console.log('✅ IoroleService initialized');
  }

  /**
   * Get all roles (system and company-specific)
   */
  async getRoles(status?: string, company_id?: number): Promise<any> {
    try {
      let query = `
        SELECT 
          role_id,
          role_name,
          role_code,
          description,
          company_id,
          level,
          permissions,
          status,
          is_system,
          created_at,
          updated_at
        FROM io_role
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status) {
        query += ` AND status = ?`;
        params.push(status);
      }

      if (company_id !== undefined && company_id !== null) {
        query += ` AND company_id = ?`;
        params.push(company_id);
      }

      query += ` ORDER BY level DESC, role_name ASC`;

      console.log('📊 Executing getRoles query:', query);
      console.log('📊 With params:', params);

      const roles = await this.dataSource.query(query, params);

      console.log(`✅ Found ${roles.length} roles`);

      return {
        status: 'success',
        message: `Found ${roles.length} roles`,
        data: roles,
      };
    } catch (error) {
      console.error('❌ Error fetching roles:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch roles',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a single role by ID
   */
  async getRoleById(role_id: number): Promise<any> {
    try {
      const query = `
        SELECT 
          role_id,
          role_name,
          role_code,
          description,
          company_id,
          level,
          permissions,
          status,
          is_system,
          created_at,
          updated_at
        FROM io_role
        WHERE role_id = ?
      `;

      console.log('📊 Fetching role by ID:', role_id);

      const result = await this.dataSource.query(query, [role_id]);

      if (result.length === 0) {
        console.log('⚠️  Role not found');
        return {
          status: 'not_found',
          message: `Role with ID ${role_id} not found`,
          data: null,
        };
      }

      console.log('✅ Role found:', result[0].role_name);

      return {
        status: 'success',
        message: 'Role fetched successfully',
        data: result[0],
      };
    } catch (error) {
      console.error('❌ Error fetching role:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get role by code
   */
  async getRoleByCode(role_code: string, company_id?: number): Promise<any> {
    try {
      let query = `
        SELECT 
          role_id,
          role_name,
          role_code,
          description,
          company_id,
          level,
          permissions,
          status,
          is_system
        FROM io_role
        WHERE role_code = ?
        AND status = 'active'
      `;
      const params: any[] = [role_code];

      if (company_id !== undefined && company_id !== null) {
        query += ` AND company_id = ?`;
        params.push(company_id);
      }

      query += ` LIMIT 1`;

      console.log('📊 Fetching role by code:', role_code);

      const result = await this.dataSource.query(query, params);

      if (result.length === 0) {
        console.log('⚠️  Role not found');
        return {
          status: 'not_found',
          message: `Role with code ${role_code} not found`,
          data: null,
        };
      }

      console.log('✅ Role found:', result[0].role_name);

      return {
        status: 'success',
        message: 'Role fetched successfully',
        data: result[0],
      };
    } catch (error) {
      console.error('❌ Error fetching role by code:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a new role
   */
  async createRole(roleData: CreateRoleDto): Promise<any> {
    try {
      const {
        role_name,
        role_code,
        description,
        company_id,
        level,
        permissions,
        status,
        is_system,
        created_by,
      } = roleData;

      console.log('📝 Creating new role:', role_name);
      console.log('📝 Role code:', role_code);
      console.log('📝 Company ID:', company_id);

      const existingRoleQuery = `
        SELECT role_id, role_name 
        FROM io_role 
        WHERE role_code = ? 
        AND company_id = ?
      `;
      
      const existingRole = await this.dataSource.query(existingRoleQuery, [
        role_code,
        company_id,
      ]);

      if (existingRole.length > 0) {
        console.log('❌ Role code already exists:', existingRole[0].role_name);
        throw new HttpException(
          {
            status: 'error',
            message: `Role with code '${role_code}' already exists for this company`,
            existing_role: existingRole[0].role_name,
          },
          HttpStatus.CONFLICT,
        );
      }

      const sql = `
        INSERT INTO io_role (
          role_name,
          role_code,
          description,
          company_id,
          level,
          permissions,
          status,
          is_system,
          created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        role_name,
        role_code,
        description || null,
        company_id,
        level !== undefined ? level : 0,
        permissions ? JSON.stringify(permissions) : null,
        status || 'active',
        is_system ? 1 : 0,
        created_by || null,
      ];

      console.log('📝 Inserting role with values:', values);

      const result = await this.dataSource.query(sql, values);

      console.log('✅ Role created successfully with ID:', result.insertId);

      return {
        status: 'success',
        message: 'Role created successfully',
        data: {
          role_id: result.insertId,
          role_name,
          role_code,
        },
      };
    } catch (error) {
      console.error('❌ Error creating role:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update a role
   */
  async updateRole(role_id: number, roleData: UpdateRoleDto): Promise<any> {
    try {
      console.log('📝 Updating role ID:', role_id);
      console.log('📝 Update data:', roleData);

      const [existingRole] = await this.dataSource.query(
        `SELECT role_id, role_name, role_code, is_system FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      if (!existingRole) {
        console.log('❌ Role not found');
        throw new HttpException(
          {
            status: 'error',
            message: `Role with ID ${role_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (existingRole.is_system === 1) {
        console.log('❌ Attempted to modify system role:', existingRole.role_name);
        throw new HttpException(
          {
            status: 'error',
            message: 'Cannot modify system roles',
            role_name: existingRole.role_name,
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const updates: string[] = [];
      const values: any[] = [];

      function addField(fieldName: string, value: any) {
        if (value !== null && value !== undefined) {
          updates.push(`${fieldName} = ?`);
          values.push(value);
        }
      }

      addField('role_name', roleData.role_name);
      addField('description', roleData.description);
      addField('level', roleData.level);
      addField('permissions', roleData.permissions ? JSON.stringify(roleData.permissions) : null);
      addField('status', roleData.status);
      addField('updated_by', roleData.updated_by);

      if (updates.length === 0) {
        console.log('⚠️  No fields to update');
        return {
          status: 'success',
          message: 'No fields to update',
        };
      }

      updates.push('updated_at = NOW()');
      values.push(role_id);

      const sql = `
        UPDATE io_role SET
          ${updates.join(', ')}
        WHERE role_id = ?
      `;

      console.log('📝 Executing update query:', sql);
      console.log('📝 With values:', values);

      await this.dataSource.query(sql, values);

      console.log('✅ Role updated successfully:', existingRole.role_name);

      return {
        status: 'success',
        message: 'Role updated successfully',
        data: {
          role_id,
          role_name: roleData.role_name || existingRole.role_name,
          role_code: existingRole.role_code,
        },
      };
    } catch (error) {
      console.error('❌ Error updating role:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a role (soft delete)
   */
  async deleteRole(role_id: number): Promise<any> {
    try {
      console.log('🗑️  Attempting to delete role ID:', role_id);

      const [existingRole] = await this.dataSource.query(
        `SELECT role_id, role_name, role_code, is_system, status FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      if (!existingRole) {
        console.log('❌ Role not found');
        throw new HttpException(
          {
            status: 'error',
            message: `Role with ID ${role_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('📋 Found role:', existingRole.role_name);

      if (existingRole.is_system === 1) {
        console.log('❌ Attempted to delete system role:', existingRole.role_name);
        throw new HttpException(
          {
            status: 'error',
            message: 'Cannot delete system roles',
            role_name: existingRole.role_name,
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const usersWithRole = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM io_user WHERE role_id = ? AND status != 'delete'`,
        [role_id],
      );

      const userCount = usersWithRole[0].count;
      console.log('👥 Users assigned to this role:', userCount);

      if (userCount > 0) {
        console.log('❌ Cannot delete role with assigned users');
        throw new HttpException(
          {
            status: 'error',
            message: `Cannot delete role. ${userCount} user${userCount > 1 ? 's are' : ' is'} currently assigned to this role.`,
            role_name: existingRole.role_name,
            user_count: userCount,
          },
          HttpStatus.CONFLICT,
        );
      }

      await this.dataSource.query(
        `UPDATE io_role SET status = 'inactive', updated_at = NOW() WHERE role_id = ?`,
        [role_id],
      );

      console.log('✅ Role deleted successfully (soft delete):', existingRole.role_name);

      return {
        status: 'success',
        message: 'Role deleted successfully',
        data: {
          role_id,
          role_name: existingRole.role_name,
          role_code: existingRole.role_code,
        },
      };
    } catch (error) {
      console.error('❌ Error deleting role:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Hard delete a role
   */
  async hardDeleteRole(role_id: number): Promise<any> {
    try {
      console.log('⚠️  HARD DELETE - Role ID:', role_id);

      const [existingRole] = await this.dataSource.query(
        `SELECT role_id, role_name, is_system FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      if (!existingRole) {
        throw new HttpException(
          {
            status: 'error',
            message: `Role with ID ${role_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (existingRole.is_system === 1) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Cannot delete system roles',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const usersWithRole = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM io_user WHERE role_id = ? AND status != 'delete'`,
        [role_id],
      );

      if (usersWithRole[0].count > 0) {
        throw new HttpException(
          {
            status: 'error',
            message: `Cannot delete role. ${usersWithRole[0].count} users are currently assigned to this role.`,
          },
          HttpStatus.CONFLICT,
        );
      }

      await this.dataSource.query(
        `DELETE FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      console.log('✅ Role permanently deleted:', existingRole.role_name);

      return {
        status: 'success',
        message: 'Role permanently deleted',
        data: {
          role_id,
          role_name: existingRole.role_name,
        },
      };
    } catch (error) {
      console.error('❌ Error in hard delete:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Restore a deleted role
   */
  async restoreRole(role_id: number): Promise<any> {
    try {
      console.log('🔄 Restoring role ID:', role_id);

      const [existingRole] = await this.dataSource.query(
        `SELECT role_id, role_name, status FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      if (!existingRole) {
        throw new HttpException(
          {
            status: 'error',
            message: `Role with ID ${role_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (existingRole.status === 'active') {
        return {
          status: 'success',
          message: 'Role is already active',
          data: {
            role_id,
            role_name: existingRole.role_name,
          },
        };
      }

      await this.dataSource.query(
        `UPDATE io_role SET status = 'active', updated_at = NOW() WHERE role_id = ?`,
        [role_id],
      );

      console.log('✅ Role restored successfully:', existingRole.role_name);

      return {
        status: 'success',
        message: 'Role restored successfully',
        data: {
          role_id,
          role_name: existingRole.role_name,
        },
      };
    } catch (error) {
      console.error('❌ Error restoring role:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to restore role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get roles with user count
   */
  async getRolesWithUserCount(company_id?: number): Promise<any> {
    try {
      let query = `
        SELECT 
          r.role_id,
          r.role_name,
          r.role_code,
          r.level,
          r.status,
          r.is_system,
          r.company_id,
          COUNT(u.user_id) as user_count
        FROM io_role r
        LEFT JOIN io_user u ON r.role_id = u.role_id AND u.status != 'delete'
        WHERE 1=1
      `;
      const params: any[] = [];

      if (company_id !== undefined && company_id !== null) {
        query += ` AND r.company_id = ?`;
        params.push(company_id);
      }

      query += ` GROUP BY r.role_id ORDER BY r.level DESC, r.role_name ASC`;

      console.log('📊 Fetching roles with user counts');

      const roles = await this.dataSource.query(query, params);

      console.log(`✅ Found ${roles.length} roles with user counts`);

      return {
        status: 'success',
        message: `Found ${roles.length} roles`,
        data: roles,
      };
    } catch (error) {
      console.error('❌ Error fetching roles with user count:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch roles',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ============================================================
  // ROLE-PERMISSION MAPPING METHODS
  // ============================================================

  /**
   * Get permissions assigned to a specific role
   */
  async getRolePermissions(role_id: number): Promise<any> {
    try {
      console.log('🔐 Fetching permissions for role ID:', role_id);

      const [existingRole] = await this.dataSource.query(
        `SELECT role_id, role_name FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      if (!existingRole) {
        console.log('❌ Role not found');
        throw new HttpException(
          {
            status: 'error',
            message: `Role with ID ${role_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('📋 Role found:', existingRole.role_name);

      const query = `
        SELECT 
          p.permission_id,
          p.module_name,
          p.module_code,
          p.description,
          p.display_order,
          p.is_active,
          rp.can_read,
          rp.can_write,
          rp.can_approve,
          rp.can_delete,
          rp.access_level,
          rp.custom_permissions,
          rp.created_at as assigned_at
        FROM io_role_permission rp
        INNER JOIN io_permission p ON rp.permission_id = p.permission_id
        WHERE rp.role_id = ?
        ORDER BY p.display_order ASC, p.module_name ASC
      `;

      const permissions = await this.dataSource.query(query, [role_id]);

      console.log(`✅ Found ${permissions.length} permissions for role: ${existingRole.role_name}`);

      return {
        status: 'success',
        message: `Found ${permissions.length} permissions`,
        data: permissions,
        role: {
          role_id: existingRole.role_id,
          role_name: existingRole.role_name,
        },
      };
    } catch (error) {
      console.error('❌ Error fetching role permissions:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch role permissions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update permissions for a role (FIXED - NO created_by column)
   */
  async updateRolePermissions(
    role_id: number,
    permission_ids: number[],
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('🔐 Updating permissions for role ID:', role_id);
      console.log('🔐 New permission IDs:', permission_ids);

      const [existingRole] = await queryRunner.query(
        `SELECT role_id, role_name, is_system FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      if (!existingRole) {
        console.log('❌ Role not found');
        throw new HttpException(
          {
            status: 'error',
            message: `Role with ID ${role_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (existingRole.is_system === 1) {
        console.log('❌ Attempted to modify permissions of system role:', existingRole.role_name);
        throw new HttpException(
          {
            status: 'error',
            message: 'Cannot modify permissions of system roles',
            role_name: existingRole.role_name,
          },
          HttpStatus.FORBIDDEN,
        );
      }

      console.log('📋 Role found:', existingRole.role_name);

      if (permission_ids && permission_ids.length > 0) {
        const placeholders = permission_ids.map(() => '?').join(',');
        const validPermissions = await queryRunner.query(
          `SELECT permission_id FROM io_permission WHERE permission_id IN (${placeholders})`,
          permission_ids,
        );

        if (validPermissions.length !== permission_ids.length) {
          const validIds = validPermissions.map((p) => p.permission_id);
          const invalidIds = permission_ids.filter((id) => !validIds.includes(id));
          console.log('❌ Invalid permission IDs:', invalidIds);
          
          throw new HttpException(
            {
              status: 'error',
              message: 'Some permission IDs are invalid',
              invalid_ids: invalidIds,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      await queryRunner.query(
        `DELETE FROM io_role_permission WHERE role_id = ?`,
        [role_id],
      );

      console.log('🗑️  Removed existing permissions');

      if (permission_ids && permission_ids.length > 0) {
        // FIXED: Removed created_by column entirely
        const insertValues = permission_ids.map((permission_id) => 
          `(${role_id}, ${permission_id})`
        ).join(', ');

        const insertQuery = `
          INSERT INTO io_role_permission (role_id, permission_id)
          VALUES ${insertValues}
        `;

        await queryRunner.query(insertQuery);

        console.log(`✅ Assigned ${permission_ids.length} permissions to role`);
      } else {
        console.log('✅ All permissions removed from role');
      }

      await queryRunner.query(
        `UPDATE io_role SET updated_at = NOW() WHERE role_id = ?`,
        [role_id],
      );

      await queryRunner.commitTransaction();

      console.log('✅ Role permissions updated successfully:', existingRole.role_name);

      return {
        status: 'success',
        message: 'Role permissions updated successfully',
        data: {
          role_id,
          role_name: existingRole.role_name,
          permission_count: permission_ids?.length || 0,
          permission_ids: permission_ids || [],
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error updating role permissions:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update role permissions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Add permissions to a role (FIXED - NO created_by column)
   */
  async addPermissionsToRole(
    role_id: number,
    permission_ids: number[],
  ): Promise<any> {
    try {
      console.log('➕ Adding permissions to role ID:', role_id);
      console.log('➕ Permission IDs to add:', permission_ids);

      const [existingRole] = await this.dataSource.query(
        `SELECT role_id, role_name, is_system FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      if (!existingRole) {
        throw new HttpException(
          {
            status: 'error',
            message: `Role with ID ${role_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (existingRole.is_system === 1) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Cannot modify permissions of system roles',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const existingPermissions = await this.dataSource.query(
        `SELECT permission_id FROM io_role_permission WHERE role_id = ?`,
        [role_id],
      );

      const existingIds = existingPermissions.map((p) => p.permission_id);
      const newPermissionIds = permission_ids.filter((id) => !existingIds.includes(id));

      if (newPermissionIds.length === 0) {
        console.log('ℹ️  All permissions already assigned');
        return {
          status: 'success',
          message: 'All permissions already assigned to this role',
          data: {
            role_id,
            role_name: existingRole.role_name,
            added_count: 0,
          },
        };
      }

      // FIXED: Removed created_by column entirely
      const insertValues = newPermissionIds.map((permission_id) => 
        `(${role_id}, ${permission_id})`
      ).join(', ');

      const insertQuery = `
        INSERT INTO io_role_permission (role_id, permission_id)
        VALUES ${insertValues}
      `;

      await this.dataSource.query(insertQuery);

      console.log(`✅ Added ${newPermissionIds.length} new permissions to role`);

      return {
        status: 'success',
        message: `Added ${newPermissionIds.length} permissions to role`,
        data: {
          role_id,
          role_name: existingRole.role_name,
          added_count: newPermissionIds.length,
          added_permission_ids: newPermissionIds,
        },
      };
    } catch (error) {
      console.error('❌ Error adding permissions to role:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to add permissions to role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Remove permissions from a role
   */
  async removePermissionsFromRole(
    role_id: number,
    permission_ids: number[],
  ): Promise<any> {
    try {
      console.log('➖ Removing permissions from role ID:', role_id);
      console.log('➖ Permission IDs to remove:', permission_ids);

      const [existingRole] = await this.dataSource.query(
        `SELECT role_id, role_name, is_system FROM io_role WHERE role_id = ?`,
        [role_id],
      );

      if (!existingRole) {
        throw new HttpException(
          {
            status: 'error',
            message: `Role with ID ${role_id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (existingRole.is_system === 1) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Cannot modify permissions of system roles',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const placeholders = permission_ids.map(() => '?').join(',');
      const result = await this.dataSource.query(
        `DELETE FROM io_role_permission WHERE role_id = ? AND permission_id IN (${placeholders})`,
        [role_id, ...permission_ids],
      );

      console.log(`✅ Removed ${result.affectedRows} permissions from role`);

      return {
        status: 'success',
        message: `Removed ${result.affectedRows} permissions from role`,
        data: {
          role_id,
          role_name: existingRole.role_name,
          removed_count: result.affectedRows,
        },
      };
    } catch (error) {
      console.error('❌ Error removing permissions from role:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to remove permissions from role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Copy permissions from one role to another (FIXED - removed created_by parameter)
   */
  async copyRolePermissions(
    source_role_id: number,
    target_role_id: number,
    replace: boolean = false,
  ): Promise<any> {
    try {
      console.log('📋 Copying permissions from role', source_role_id, 'to role', target_role_id);

      const roles = await this.dataSource.query(
        `SELECT role_id, role_name, is_system FROM io_role WHERE role_id IN (?, ?)`,
        [source_role_id, target_role_id],
      );

      if (roles.length !== 2) {
        throw new HttpException(
          {
            status: 'error',
            message: 'One or both roles not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const targetRole = roles.find((r) => r.role_id === target_role_id);
      if (targetRole?.is_system === 1) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Cannot modify permissions of system roles',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const sourcePermissions = await this.dataSource.query(
        `SELECT permission_id FROM io_role_permission WHERE role_id = ?`,
        [source_role_id],
      );

      const permission_ids = sourcePermissions.map((p) => p.permission_id);

      if (permission_ids.length === 0) {
        return {
          status: 'success',
          message: 'Source role has no permissions to copy',
          data: {
            source_role_id,
            target_role_id,
            copied_count: 0,
          },
        };
      }

      // FIXED: Removed created_by parameter from method calls
      if (replace) {
        return await this.updateRolePermissions(target_role_id, permission_ids);
      } else {
        return await this.addPermissionsToRole(target_role_id, permission_ids);
      }
    } catch (error) {
      console.error('❌ Error copying role permissions:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to copy role permissions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ============================================================
  // USER PERMISSION CHECK METHODS
  // ============================================================

  /**
   * Check if a user has access to a specific module
   */
  async checkUserModuleAccess(
    user_id: number,
    module_code: string,
  ): Promise<any> {
    try {
      console.log('🔐 Checking module access for user:', user_id, 'module:', module_code);

      const [user] = await this.dataSource.query(
        `SELECT role_id, name FROM io_user WHERE user_id = ? AND status != 'delete'`,
        [user_id],
      );

      if (!user) {
        console.log('❌ User not found');
        return {
          status: 'error',
          message: 'User not found',
          hasAccess: false,
        };
      }

      console.log('👤 User role_id:', user.role_id);

      if (user.role_id === 1) {
        console.log('✅ Super Admin - full access granted');
        return {
          status: 'success',
          message: 'Super Admin has full access',
          hasAccess: true,
          isSuperAdmin: true,
        };
      }

      const query = `
        SELECT 
          rp.can_read,
          rp.can_write,
          rp.can_approve,
          rp.can_delete,
          rp.access_level,
          p.module_name,
          p.module_code
        FROM io_role_permission rp
        INNER JOIN io_permission p ON rp.permission_id = p.permission_id
        WHERE rp.role_id = ? 
        AND p.module_code = ?
        AND p.is_active = 1
      `;

      const [permission] = await this.dataSource.query(query, [
        user.role_id,
        module_code,
      ]);

      if (!permission) {
        console.log('❌ No permission found for this module');
        return {
          status: 'success',
          message: 'No access to this module',
          hasAccess: false,
        };
      }

      const hasAccess = permission.can_read === 1;
      console.log(hasAccess ? '✅ Access granted' : '❌ Access denied');

      return {
        status: 'success',
        message: hasAccess ? 'Access granted' : 'Access denied',
        hasAccess,
        permissions: {
          canRead: permission.can_read === 1,
          canWrite: permission.can_write === 1,
          canApprove: permission.can_approve === 1,
          canDelete: permission.can_delete === 1,
          accessLevel: permission.access_level,
        },
      };
    } catch (error) {
      console.error('❌ Error checking user module access:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to check module access',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get detailed permissions for a user on a specific module
   */
  async getUserModulePermissions(
    user_id: number,
    module_code: string,
  ): Promise<any> {
    try {
      console.log('🔐 Getting detailed permissions for user:', user_id, 'module:', module_code);

      const [user] = await this.dataSource.query(
        `SELECT role_id, name FROM io_user WHERE user_id = ? AND status != 'delete'`,
        [user_id],
      );

      if (!user) {
        return {
          status: 'error',
          message: 'User not found',
          can_read: false,
          can_write: false,
          can_approve: false,
          can_delete: false,
        };
      }

      if (user.role_id === 1) {
        return {
          status: 'success',
          message: 'Super Admin permissions',
          can_read: true,
          can_write: true,
          can_approve: true,
          can_delete: true,
          access_level: 'full_access',
          isSuperAdmin: true,
        };
      }

      const query = `
        SELECT 
          rp.can_read,
          rp.can_write,
          rp.can_approve,
          rp.can_delete,
          rp.access_level,
          p.module_name,
          p.module_code
        FROM io_role_permission rp
        INNER JOIN io_permission p ON rp.permission_id = p.permission_id
        WHERE rp.role_id = ? 
        AND p.module_code = ?
        AND p.is_active = 1
      `;

      const [permission] = await this.dataSource.query(query, [
        user.role_id,
        module_code,
      ]);

      if (!permission) {
        return {
          status: 'success',
          message: 'No permissions for this module',
          can_read: false,
          can_write: false,
          can_approve: false,
          can_delete: false,
          access_level: 'no_access',
        };
      }

      return {
        status: 'success',
        message: 'Permissions retrieved',
        can_read: permission.can_read === 1,
        can_write: permission.can_write === 1,
        can_approve: permission.can_approve === 1,
        can_delete: permission.can_delete === 1,
        access_level: permission.access_level,
        module_name: permission.module_name,
        module_code: permission.module_code,
      };
    } catch (error) {
      console.error('❌ Error getting user module permissions:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to get permissions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get ALL permissions for a user (main method for Flutter app)
   */
  async getAllUserPermissions(user_id: number): Promise<any> {
    try {
      console.log('🔐 Getting all permissions for user:', user_id);

      const [user] = await this.dataSource.query(
        `SELECT role_id, name FROM io_user WHERE user_id = ? AND status != 'delete'`,
        [user_id],
      );

      if (!user) {
        return {
          status: 'error',
          message: 'User not found',
          permissions: [],
        };
      }

      console.log('👤 User:', user.name, 'Role ID:', user.role_id);

      const isSuperAdmin = user.role_id === 1;

      if (isSuperAdmin) {
        const allPermissions = await this.dataSource.query(`
          SELECT 
            permission_id,
            module_name,
            module_code,
            description,
            display_order
          FROM io_permission
          WHERE is_active = 1
          ORDER BY display_order ASC
        `);

        const permissions = allPermissions.map((p) => ({
          permission_id: p.permission_id,
          module_name: p.module_name,
          module_code: p.module_code,
          description: p.description,
          can_read: 1,
          can_write: 1,
          can_approve: 1,
          can_delete: 1,
          access_level: 'full_access',
        }));

        console.log(`✅ Super Admin - ${permissions.length} permissions`);

        return {
          status: 'success',
          message: 'Super Admin - All permissions granted',
          isSuperAdmin: true,
          permissions,
        };
      }

      const query = `
        SELECT 
          p.permission_id,
          p.module_name,
          p.module_code,
          p.description,
          p.display_order,
          rp.can_read,
          rp.can_write,
          rp.can_approve,
          rp.can_delete,
          rp.access_level
        FROM io_role_permission rp
        INNER JOIN io_permission p ON rp.permission_id = p.permission_id
        WHERE rp.role_id = ?
        AND p.is_active = 1
        AND rp.can_read = 1
        ORDER BY p.display_order ASC, p.module_name ASC
      `;

      const permissions = await this.dataSource.query(query, [user.role_id]);

      console.log(`✅ Found ${permissions.length} permissions for user`);

      return {
        status: 'success',
        message: `Found ${permissions.length} permissions`,
        isSuperAdmin: false,
        permissions,
      };
    } catch (error) {
      console.error('❌ Error getting all user permissions:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to get user permissions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Check if user is Super Admin
   */
  async checkIsSuperAdmin(user_id: number): Promise<any> {
    try {
      const [user] = await this.dataSource.query(
        `SELECT role_id FROM io_user WHERE user_id = ? AND status != 'delete'`,
        [user_id],
      );

      if (!user) {
        return {
          status: 'error',
          message: 'User not found',
          isSuperAdmin: false,
        };
      }

      const isSuperAdmin = user.role_id === 1;

      return {
        status: 'success',
        message: isSuperAdmin ? 'User is Super Admin' : 'User is not Super Admin',
        isSuperAdmin,
      };
    } catch (error) {
      console.error('❌ Error checking Super Admin status:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to check Super Admin status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get user's accessible menu items
   */
  async getUserAccessibleMenus(user_id: number): Promise<any> {
    try {
      console.log('📋 Getting accessible menus for user:', user_id);

      const permissionsResult = await this.getAllUserPermissions(user_id);

      if (permissionsResult.status === 'error') {
        return permissionsResult;
      }

      const accessibleMenus = permissionsResult.permissions.map((p) => ({
        module_code: p.module_code,
        module_name: p.module_name,
        can_read: p.can_read === 1,
        can_write: p.can_write === 1,
        can_approve: p.can_approve === 1,
        can_delete: p.can_delete === 1,
      }));

      return {
        status: 'success',
        message: `Found ${accessibleMenus.length} accessible menus`,
        isSuperAdmin: permissionsResult.isSuperAdmin,
        menus: accessibleMenus,
      };
    } catch (error) {
      console.error('❌ Error getting accessible menus:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to get accessible menus',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}