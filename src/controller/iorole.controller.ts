import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IoroleService } from '../service/iorole.service';

/**
 * Controller for Role Management
 * Base Route: /api/iorole
 * 
 * Available Endpoints:
 * 
 * Role Management:
 * - GET    /api/iorole                        - List all roles
 * - GET    /api/iorole/with-user-count        - List roles with user counts
 * - GET    /api/iorole/code/:code             - Get role by code
 * - GET    /api/iorole/:id                    - Get single role by ID
 * - POST   /api/iorole                        - Create new role
 * - PUT    /api/iorole/:id                    - Update existing role
 * - DELETE /api/iorole/:id                    - Delete role (soft delete)
 * - DELETE /api/iorole/:id/hard               - Hard delete role (permanent)
 * - POST   /api/iorole/:id/restore            - Restore deleted role
 * 
 * Role-Permission Mapping:
 * - GET    /api/iorole/:id/permissions        - Get permissions for a role
 * - PUT    /api/iorole/:id/permissions        - Update (replace) permissions
 * - POST   /api/iorole/:id/permissions/add    - Add permissions (additive)
 * - POST   /api/iorole/:id/permissions/remove - Remove permissions
 * - POST   /api/iorole/:id/permissions/copy   - Copy permissions from another role
 * 
 * User Permission Checks (NEW):
 * - GET    /api/iorole/user/:user_id/check/:module_code           - Check user module access
 * - GET    /api/iorole/user/:user_id/module/:module_code          - Get user module permissions
 * - GET    /api/iorole/user/:user_id/all-permissions              - Get all user permissions
 * - GET    /api/iorole/user/:user_id/is-super-admin               - Check if Super Admin
 * - GET    /api/iorole/user/:user_id/accessible-menus             - Get accessible menus
 */
@Controller('iorole')
export class IoroleController {
  constructor(private readonly ioroleService: IoroleService) {
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

  // ============================================================
  // ROLE MANAGEMENT ENDPOINTS
  // ============================================================

  /**
   * GET /api/iorole
   * Get all roles with optional filters
   */
  @Get()
  async getRoles(
    @Query('status') status?: string,
    @Query('company_id') company_id?: string,
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole - Get Roles');
    console.log('   Query Parameters:');
    console.log('   - status:', status || 'all');
    console.log('   - company_id:', company_id || 'all');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const companyIdNum = company_id ? parseInt(company_id) : undefined;
      
      if (company_id && isNaN(companyIdNum)) {
        throw new HttpException(
          {
            status: 'error',
            message: 'company_id must be a valid number',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.ioroleService.getRoles(status, companyIdNum);
      
      console.log('✅ Success - Found', result.data?.length || 0, 'roles');
      return result;
    } catch (error) {
      console.error('❌ Error in getRoles controller:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
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
   * GET /api/iorole/with-user-count
   * Get all roles with user counts (for admin dashboards)
   */
  @Get('with-user-count')
  async getRolesWithUserCount(
    @Query('company_id') company_id?: string,
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/with-user-count - Get Roles With User Count');
    console.log('   Query Parameters:');
    console.log('   - company_id:', company_id || 'all');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const companyIdNum = company_id ? parseInt(company_id) : undefined;
      
      if (company_id && isNaN(companyIdNum)) {
        throw new HttpException(
          {
            status: 'error',
            message: 'company_id must be a valid number',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.ioroleService.getRolesWithUserCount(companyIdNum);
      
      console.log('✅ Success - Found', result.data?.length || 0, 'roles with user counts');
      return result;
    } catch (error) {
      console.error('❌ Error in getRolesWithUserCount controller:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch roles with user count',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/iorole/code/:code
   * Get a role by its role_code
   */
  @Get('code/:code')
  async getRoleByCode(
    @Param('code') code: string,
    @Query('company_id') company_id?: string,
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/code/:code - Get Role by Code');
    console.log('   Role Code:', code);
    console.log('   Company ID:', company_id || 'all');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const companyIdNum = company_id ? parseInt(company_id) : undefined;
      
      if (company_id && isNaN(companyIdNum)) {
        throw new HttpException(
          {
            status: 'error',
            message: 'company_id must be a valid number',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.ioroleService.getRoleByCode(code, companyIdNum);
      
      if (result.status === 'not_found') {
        console.log('⚠️  Role not found');
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      }
      
      console.log('✅ Success - Role found:', result.data?.role_name);
      return result;
    } catch (error) {
      console.error('❌ Error in getRoleByCode controller:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch role by code',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/iorole/:id
   * Get a single role by ID
   */
  @Get(':id')
  async getRoleById(@Param('id', ParseIntPipe) id: number) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/:id - Get Role by ID');
    console.log('   Role ID:', id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const result = await this.ioroleService.getRoleById(id);
      
      if (result.status === 'not_found') {
        console.log('⚠️  Role not found');
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      }
      
      console.log('✅ Success - Role found:', result.data?.role_name);
      return result;
    } catch (error) {
      console.error('❌ Error in getRoleById controller:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
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
   * POST /api/iorole
   * Create a new role
   */
  @Post()
  async createRole(@Body() roleData: any) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 POST /api/iorole - Create Role');
    console.log('   Request Body:', JSON.stringify(roleData, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Validation
    const errors: string[] = [];

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
      throw new HttpException(
        {
          status: 'error',
          message: 'Validation failed',
          errors: errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.ioroleService.createRole(roleData);
      console.log('✅ Success - Role created:', roleData.role_name);
      return result;
    } catch (error) {
      console.error('❌ Error in createRole controller:', error);
      
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
   * PUT /api/iorole/:id
   * Update an existing role
   */
  @Put(':id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() roleData: any,
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 PUT /api/iorole/:id - Update Role');
    console.log('   Role ID:', id);
    console.log('   Request Body:', JSON.stringify(roleData, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!roleData || Object.keys(roleData).length === 0) {
      console.log('❌ Validation Error: Request body is empty');
      throw new HttpException(
        {
          status: 'error',
          message: 'Request body cannot be empty',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.ioroleService.updateRole(id, roleData);
      console.log('✅ Success - Role updated');
      return result;
    } catch (error) {
      console.error('❌ Error in updateRole controller:', error);
      
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
   * DELETE /api/iorole/:id
   * Delete a role (soft delete)
   */
  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 DELETE /api/iorole/:id - Delete Role (Soft)');
    console.log('   Role ID:', id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.deleteRole(id);
      console.log('✅ Success - Role deleted (soft delete)');
      return result;
    } catch (error) {
      console.error('❌ Error in deleteRole controller:', error);
      
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
   * DELETE /api/iorole/:id/hard
   * Hard delete a role (permanently removes from database)
   */
  @Delete(':id/hard')
  async hardDeleteRole(@Param('id', ParseIntPipe) id: number) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  DELETE /api/iorole/:id/hard - HARD DELETE Role');
    console.log('   Role ID:', id);
    console.log('   ⚠️  WARNING: This will permanently delete the role!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.hardDeleteRole(id);
      console.log('✅ Success - Role permanently deleted');
      return result;
    } catch (error) {
      console.error('❌ Error in hardDeleteRole controller:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to hard delete role',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/iorole/:id/restore
   * Restore a deleted (inactive) role
   */
  @Post(':id/restore')
  async restoreRole(@Param('id', ParseIntPipe) id: number) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 POST /api/iorole/:id/restore - Restore Role');
    console.log('   Role ID:', id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.restoreRole(id);
      console.log('✅ Success - Role restored');
      return result;
    } catch (error) {
      console.error('❌ Error in restoreRole controller:', error);
      
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

  // ============================================================
  // ROLE-PERMISSION MAPPING ENDPOINTS
  // ============================================================

  /**
   * GET /api/iorole/:id/permissions
   * Get all permissions assigned to a specific role
   */
  @Get(':id/permissions')
  async getRolePermissions(@Param('id', ParseIntPipe) id: number) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/:id/permissions - Get Role Permissions');
    console.log('   Role ID:', id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.getRolePermissions(id);
      console.log('✅ Success - Found', result.data?.length || 0, 'permissions');
      return result;
    } catch (error) {
      console.error('❌ Error in getRolePermissions controller:', error);
      
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
   * PUT /api/iorole/:id/permissions
   * Update (replace) all permissions for a role
   */
  @Put(':id/permissions')
  async updateRolePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { permission_ids: number[] },
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 PUT /api/iorole/:id/permissions - Update Role Permissions');
    console.log('   Role ID:', id);
    console.log('   Permission IDs:', JSON.stringify(body.permission_ids));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (body.permission_ids === undefined || body.permission_ids === null) {
      console.log('❌ Validation Error: permission_ids is required');
      throw new HttpException(
        {
          status: 'error',
          message: 'permission_ids is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Array.isArray(body.permission_ids)) {
      console.log('❌ Validation Error: permission_ids must be an array');
      throw new HttpException(
        {
          status: 'error',
          message: 'permission_ids must be an array',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.ioroleService.updateRolePermissions(
        id,
        body.permission_ids,
      );
      console.log('✅ Success - Permissions updated');
      return result;
    } catch (error) {
      console.error('❌ Error in updateRolePermissions controller:', error);
      
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
    }
  }

  /**
   * POST /api/iorole/:id/permissions/add
   * Add permissions to a role (additive)
   */
  @Post(':id/permissions/add')
  async addPermissionsToRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { permission_ids: number[] },
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 POST /api/iorole/:id/permissions/add - Add Permissions');
    console.log('   Role ID:', id);
    console.log('   Permission IDs to add:', JSON.stringify(body.permission_ids));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!body.permission_ids) {
      console.log('❌ Validation Error: permission_ids is required');
      throw new HttpException(
        {
          status: 'error',
          message: 'permission_ids is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Array.isArray(body.permission_ids)) {
      console.log('❌ Validation Error: permission_ids must be an array');
      throw new HttpException(
        {
          status: 'error',
          message: 'permission_ids must be an array',
        },
        HttpStatus.BAD_REQUEST,
      );
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
      const result = await this.ioroleService.addPermissionsToRole(
        id,
        body.permission_ids,
      );
      console.log('✅ Success - Permissions added');
      return result;
    } catch (error) {
      console.error('❌ Error in addPermissionsToRole controller:', error);
      
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
   * POST /api/iorole/:id/permissions/remove
   * Remove permissions from a role
   */
  @Post(':id/permissions/remove')
  async removePermissionsFromRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { permission_ids: number[] },
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 POST /api/iorole/:id/permissions/remove - Remove Permissions');
    console.log('   Role ID:', id);
    console.log('   Permission IDs to remove:', JSON.stringify(body.permission_ids));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!body.permission_ids) {
      console.log('❌ Validation Error: permission_ids is required');
      throw new HttpException(
        {
          status: 'error',
          message: 'permission_ids is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Array.isArray(body.permission_ids)) {
      console.log('❌ Validation Error: permission_ids must be an array');
      throw new HttpException(
        {
          status: 'error',
          message: 'permission_ids must be an array',
        },
        HttpStatus.BAD_REQUEST,
      );
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
      const result = await this.ioroleService.removePermissionsFromRole(
        id,
        body.permission_ids,
      );
      console.log('✅ Success - Permissions removed');
      return result;
    } catch (error) {
      console.error('❌ Error in removePermissionsFromRole controller:', error);
      
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
   * POST /api/iorole/:id/permissions/copy
   * Copy permissions from one role to another
   */
  @Post(':id/permissions/copy')
  async copyRolePermissions(
    @Param('id', ParseIntPipe) target_role_id: number,
    @Body() body: { source_role_id: number; replace?: boolean },
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 POST /api/iorole/:id/permissions/copy - Copy Permissions');
    console.log('   Target Role ID:', target_role_id);
    console.log('   Source Role ID:', body.source_role_id);
    console.log('   Replace existing:', body.replace !== undefined ? body.replace : false);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!body.source_role_id) {
      console.log('❌ Validation Error: source_role_id is required');
      throw new HttpException(
        {
          status: 'error',
          message: 'source_role_id is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof body.source_role_id !== 'number') {
      console.log('❌ Validation Error: source_role_id must be a number');
      throw new HttpException(
        {
          status: 'error',
          message: 'source_role_id must be a number',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.source_role_id === target_role_id) {
      console.log('❌ Validation Error: Cannot copy from the same role');
      throw new HttpException(
        {
          status: 'error',
          message: 'Cannot copy permissions to the same role',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const replace = body.replace !== undefined ? body.replace : false;
      const result = await this.ioroleService.copyRolePermissions(
        body.source_role_id,
        target_role_id,
        replace,
      );
      console.log('✅ Success - Permissions copied');
      return result;
    } catch (error) {
      console.error('❌ Error in copyRolePermissions controller:', error);
      
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
  // USER PERMISSION CHECK ENDPOINTS (NEW)
  // ============================================================

  /**
   * GET /api/iorole/user/:user_id/check/:module_code
   * Check if user has access to a specific module
   */
  @Get('user/:user_id/check/:module_code')
  async checkUserModuleAccess(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('module_code') module_code: string,
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/user/:user_id/check/:module_code');
    console.log('   User ID:', user_id);
    console.log('   Module Code:', module_code);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.checkUserModuleAccess(user_id, module_code);
      console.log('✅ Access check completed:', result.hasAccess ? 'GRANTED' : 'DENIED');
      return result;
    } catch (error) {
      console.error('❌ Error checking user module access:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

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
   * GET /api/iorole/user/:user_id/module/:module_code
   * Get detailed permissions for a user on a specific module
   */
  @Get('user/:user_id/module/:module_code')
  async getUserModulePermissions(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('module_code') module_code: string,
  ) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/user/:user_id/module/:module_code');
    console.log('   User ID:', user_id);
    console.log('   Module Code:', module_code);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.getUserModulePermissions(user_id, module_code);
      console.log('✅ Permissions retrieved');
      return result;
    } catch (error) {
      console.error('❌ Error getting user module permissions:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to get module permissions',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/iorole/user/:user_id/all-permissions
   * Get ALL permissions for a user (all modules they have access to)
   * Used by Flutter app to load all permissions at once
   */
  @Get('user/:user_id/all-permissions')
  async getAllUserPermissions(@Param('user_id', ParseIntPipe) user_id: number) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/user/:user_id/all-permissions');
    console.log('   User ID:', user_id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.getAllUserPermissions(user_id);
      console.log('✅ All permissions retrieved:', result.permissions?.length || 0);
      return result;
    } catch (error) {
      console.error('❌ Error getting all user permissions:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

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
   * GET /api/iorole/user/:user_id/is-super-admin
   * Check if user is Super Admin
   */
  @Get('user/:user_id/is-super-admin')
  async checkIsSuperAdmin(@Param('user_id', ParseIntPipe) user_id: number) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/user/:user_id/is-super-admin');
    console.log('   User ID:', user_id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.checkIsSuperAdmin(user_id);
      console.log('✅ Super Admin check:', result.isSuperAdmin ? 'YES' : 'NO');
      return result;
    } catch (error) {
      console.error('❌ Error checking Super Admin status:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

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
   * GET /api/iorole/user/:user_id/accessible-menus
   * Get user's accessible menu items
   * Returns list of modules the user can access
   */
  @Get('user/:user_id/accessible-menus')
  async getUserAccessibleMenus(@Param('user_id', ParseIntPipe) user_id: number) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 GET /api/iorole/user/:user_id/accessible-menus');
    console.log('   User ID:', user_id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const result = await this.ioroleService.getUserAccessibleMenus(user_id);
      console.log('✅ Accessible menus retrieved:', result.menus?.length || 0);
      return result;
    } catch (error) {
      console.error('❌ Error getting accessible menus:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

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