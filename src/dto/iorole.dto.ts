import { 
  IsOptional, 
  IsString, 
  IsNumber, 
  IsIn, 
  IsBoolean, 
  MinLength, 
  MaxLength, 
  Matches, 
  Min, 
  Max,
  IsInt,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

/**
 * DTO for GET /api/iorole query parameters
 */
export class GetRolesDto {
  @IsOptional()
  @IsIn(['active', 'inactive', 'delete'], {
    message: 'status must be one of: active, inactive, delete',
  })
  status?: string;

  @IsOptional()
  @IsNumber({}, { message: 'company_id must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'company_id must be at least 1' })
  @IsInt({ message: 'company_id must be an integer' })
  company_id?: number;
}

/**
 * DTO for POST /api/iorole - Create new role
 */
export class CreateRoleDto {
  @IsNotEmpty({ message: 'role_name is required' })
  @IsString({ message: 'role_name must be a string' })
  @MinLength(2, { message: 'role_name must be at least 2 characters long' })
  @MaxLength(100, { message: 'role_name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  role_name: string;

  @IsNotEmpty({ message: 'role_code is required' })
  @IsString({ message: 'role_code must be a string' })
  @MinLength(2, { message: 'role_code must be at least 2 characters long' })
  @MaxLength(50, { message: 'role_code must not exceed 50 characters' })
  @Matches(/^[a-z0-9_]+$/, {
    message: 'role_code must contain only lowercase letters, numbers, and underscores',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  role_code: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MaxLength(500, { message: 'description must not exceed 500 characters' })
  @Transform(({ value }) => value?.trim() || null)
  description?: string;

  @IsNotEmpty({ message: 'company_id is required' })
  @IsNumber({}, { message: 'company_id must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'company_id must be at least 1' })
  @IsInt({ message: 'company_id must be an integer' })
  company_id: number;

  @IsOptional()
  @IsNumber({}, { message: 'level must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'level must be at least 0' })
  @Max(100, { message: 'level must not exceed 100' })
  @IsInt({ message: 'level must be an integer' })
  level?: number;

  @IsOptional()
  permissions?: any;

  @IsOptional()
  @IsIn(['active', 'inactive'], {
    message: 'status must be either active or inactive',
  })
  status?: string;

  @IsOptional()
  @IsBoolean({ message: 'is_system must be a boolean' })
  @Type(() => Boolean)
  is_system?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'created_by must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'created_by must be at least 1' })
  @IsInt({ message: 'created_by must be an integer' })
  created_by?: number;
}

/**
 * DTO for PUT /api/iorole/:id - Update existing role
 * Note: Cannot update role_code, company_id, or system roles
 */
export class UpdateRoleDto {
  @IsOptional()
  @IsString({ message: 'role_name must be a string' })
  @MinLength(2, { message: 'role_name must be at least 2 characters long' })
  @MaxLength(100, { message: 'role_name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  role_name?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MaxLength(500, { message: 'description must not exceed 500 characters' })
  @Transform(({ value }) => value?.trim() || null)
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'level must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'level must be at least 0' })
  @Max(100, { message: 'level must not exceed 100' })
  @IsInt({ message: 'level must be an integer' })
  level?: number;

  @IsOptional()
  permissions?: any;

  @IsOptional()
  @IsIn(['active', 'inactive'], {
    message: 'status must be either active or inactive',
  })
  status?: string;

  @IsOptional()
  @IsNumber({}, { message: 'updated_by must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'updated_by must be at least 1' })
  @IsInt({ message: 'updated_by must be an integer' })
  updated_by?: number;
}

/**
 * DTO for GET /api/iorole/code/:code query parameters
 */
export class GetRoleByCodeDto {
  @IsOptional()
  @IsNumber({}, { message: 'company_id must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'company_id must be at least 1' })
  @IsInt({ message: 'company_id must be an integer' })
  company_id?: number;
}

/**
 * Response DTO for single role data
 */
export class RoleResponseDto {
  role_id: number;
  role_name: string;
  role_code: string;
  description?: string;
  company_id: number;
  level: number;
  permissions?: any;
  status: string;
  is_system: boolean;
  created_by?: number;
  created_at: Date;
  updated_by?: number;
  updated_at: Date;
  user_count?: number;
}

/**
 * Response DTO for list of roles
 */
export class RoleListResponseDto {
  status: string;
  message: string;
  data: RoleResponseDto[];
}

/**
 * Response DTO for single role
 */
export class SingleRoleResponseDto {
  status: string;
  message: string;
  data: RoleResponseDto | null;
}

/**
 * Response DTO for success operations
 */
export class SuccessResponseDto {
  status: string;
  message: string;
  data?: any;
}

/**
 * Response DTO for error responses
 */
export class ErrorResponseDto {
  status: string;
  message: string;
  error?: string;
  statusCode?: number;
  errors?: string[];
}

/**
 * Response DTO for not found
 */
export class NotFoundResponseDto {
  status: string;
  message: string;
  data: null;
}

/**
 * Response DTO for conflict
 */
export class ConflictResponseDto {
  status: string;
  message: string;
  existing_role?: string;
  user_count?: number;
  role_name?: string;
}

/**
 * Response DTO for forbidden
 */
export class ForbiddenResponseDto {
  status: string;
  message: string;
  role_name?: string;
}

/**
 * DTO for role statistics
 */
export class RoleStatsDto {
  total_roles: number;
  active_roles: number;
  inactive_roles: number;
  system_roles: number;
  company_roles: number;
  total_users: number;
}

/**
 * Response DTO for role with user count
 */
export class RoleWithUserCountDto {
  role_id: number;
  role_name: string;
  role_code: string;
  level: number;
  status: string;
  is_system: boolean;
  company_id: number;
  user_count: number;
}

/**
 * Response DTO for GET /api/iorole/with-user-count
 */
export class RoleWithUserCountResponseDto {
  status: string;
  message: string;
  data: RoleWithUserCountDto[];
}

// ============================================================
// ROLE-PERMISSION MAPPING DTOs
// ============================================================

/**
 * DTO for PUT /api/iorole/:id/permissions
 * Update (replace) all permissions for a role
 * 
 * @example
 * {
 *   "permission_ids": [1, 2, 3, 5, 8],
 *   "updated_by": 1
 * }
 * 
 * To remove all permissions:
 * {
 *   "permission_ids": []
 * }
 */
export class UpdateRolePermissionsDto {
  @IsNotEmpty({ message: 'permission_ids is required' })
  @IsArray({ message: 'permission_ids must be an array' })
  @IsInt({ each: true, message: 'Each permission_id must be an integer' })
  @ArrayMaxSize(1000, { message: 'Cannot assign more than 1000 permissions at once' })
  permission_ids: number[];

  @IsOptional()
  @IsNumber({}, { message: 'updated_by must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'updated_by must be at least 1' })
  @IsInt({ message: 'updated_by must be an integer' })
  updated_by?: number;
}

/**
 * DTO for POST /api/iorole/:id/permissions/add
 * Add permissions to a role (keeps existing permissions)
 * 
 * @example
 * {
 *   "permission_ids": [10, 11, 12],
 *   "created_by": 1
 * }
 */
export class AddRolePermissionsDto {
  @IsNotEmpty({ message: 'permission_ids is required' })
  @IsArray({ message: 'permission_ids must be an array' })
  @ArrayMinSize(1, { message: 'At least one permission_id is required' })
  @IsInt({ each: true, message: 'Each permission_id must be an integer' })
  @ArrayMaxSize(1000, { message: 'Cannot add more than 1000 permissions at once' })
  permission_ids: number[];

  @IsOptional()
  @IsNumber({}, { message: 'created_by must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'created_by must be at least 1' })
  @IsInt({ message: 'created_by must be an integer' })
  created_by?: number;
}

/**
 * DTO for POST /api/iorole/:id/permissions/remove
 * Remove permissions from a role
 * 
 * @example
 * {
 *   "permission_ids": [10, 11]
 * }
 */
export class RemoveRolePermissionsDto {
  @IsNotEmpty({ message: 'permission_ids is required' })
  @IsArray({ message: 'permission_ids must be an array' })
  @ArrayMinSize(1, { message: 'At least one permission_id is required' })
  @IsInt({ each: true, message: 'Each permission_id must be an integer' })
  @ArrayMaxSize(1000, { message: 'Cannot remove more than 1000 permissions at once' })
  permission_ids: number[];
}

/**
 * DTO for POST /api/iorole/:id/permissions/copy
 * Copy permissions from one role to another
 * 
 * @example
 * {
 *   "source_role_id": 2,
 *   "replace": true,
 *   "created_by": 1
 * }
 */
export class CopyRolePermissionsDto {
  @IsNotEmpty({ message: 'source_role_id is required' })
  @IsNumber({}, { message: 'source_role_id must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'source_role_id must be at least 1' })
  @IsInt({ message: 'source_role_id must be an integer' })
  source_role_id: number;

  @IsOptional()
  @IsBoolean({ message: 'replace must be a boolean' })
  @Type(() => Boolean)
  replace?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'created_by must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'created_by must be at least 1' })
  @IsInt({ message: 'created_by must be an integer' })
  created_by?: number;
}

/**
 * Response DTO for permission data
 */
export class PermissionResponseDto {
  permission_id: number;
  module_name: string;
  module_code: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  assigned_at?: Date;
}

/**
 * Response DTO for GET /api/iorole/:id/permissions
 * Returns list of permissions assigned to a role
 */
export class RolePermissionsResponseDto {
  status: string;
  message: string;
  data: PermissionResponseDto[];
  role: {
    role_id: number;
    role_name: string;
  };
}

/**
 * Response DTO for permission update operations
 * Used for PUT/POST /api/iorole/:id/permissions/*
 */
export class UpdatePermissionsResponseDto {
  status: string;
  message: string;
  data: {
    role_id: number;
    role_name: string;
    permission_count?: number;
    permission_ids?: number[];
    added_count?: number;
    added_permission_ids?: number[];
    removed_count?: number;
    copied_count?: number;
  };
}

/**
 * Response DTO for permission errors
 */
export class PermissionErrorResponseDto {
  status: string;
  message: string;
  invalid_ids?: number[];
  role_name?: string;
  error?: string;
}

/**
 * DTO for validating permission IDs in batch operations
 */
export class ValidatePermissionIdsDto {
  @IsNotEmpty({ message: 'permission_ids is required' })
  @IsArray({ message: 'permission_ids must be an array' })
  @IsInt({ each: true, message: 'Each permission_id must be an integer' })
  permission_ids: number[];
}

/**
 * Response DTO for permission validation
 */
export class PermissionValidationResponseDto {
  valid: boolean;
  valid_ids: number[];
  invalid_ids: number[];
  message: string;
}

/**
 * DTO for bulk role-permission operations
 * Used for assigning same permissions to multiple roles
 */
export class BulkAssignPermissionsDto {
  @IsNotEmpty({ message: 'role_ids is required' })
  @IsArray({ message: 'role_ids must be an array' })
  @ArrayMinSize(1, { message: 'At least one role_id is required' })
  @IsInt({ each: true, message: 'Each role_id must be an integer' })
  @ArrayMaxSize(100, { message: 'Cannot update more than 100 roles at once' })
  role_ids: number[];

  @IsNotEmpty({ message: 'permission_ids is required' })
  @IsArray({ message: 'permission_ids must be an array' })
  @IsInt({ each: true, message: 'Each permission_id must be an integer' })
  @ArrayMaxSize(1000, { message: 'Cannot assign more than 1000 permissions at once' })
  permission_ids: number[];

  @IsOptional()
  @IsBoolean({ message: 'replace must be a boolean' })
  @Type(() => Boolean)
  replace?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'updated_by must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'updated_by must be at least 1' })
  @IsInt({ message: 'updated_by must be an integer' })
  updated_by?: number;
}

/**
 * Response DTO for bulk operations
 */
export class BulkOperationResponseDto {
  status: string;
  message: string;
  data: {
    total_roles: number;
    successful: number;
    failed: number;
    results: Array<{
      role_id: number;
      role_name: string;
      success: boolean;
      error?: string;
    }>;
  };
}

/**
 * DTO for role permission summary
 */
export class RolePermissionSummaryDto {
  role_id: number;
  role_name: string;
  role_code: string;
  company_id: number;
  permission_count: number;
  permissions: PermissionResponseDto[];
  last_updated?: Date;
}

/**
 * Response DTO for getting multiple role permissions
 */
export class MultipleRolePermissionsResponseDto {
  status: string;
  message: string;
  data: RolePermissionSummaryDto[];
}

/**
 * DTO for creating a role with permissions in one request
 */
export class CreateRoleWithPermissionsDto extends CreateRoleDto {
  @IsOptional()
  @IsArray({ message: 'permission_ids must be an array' })
  @IsInt({ each: true, message: 'Each permission_id must be an integer' })
  @ArrayMaxSize(1000, { message: 'Cannot assign more than 1000 permissions at once' })
  permission_ids?: number[];
}

/**
 * Response DTO for role creation with permissions
 */
export class CreateRoleWithPermissionsResponseDto {
  status: string;
  message: string;
  data: {
    role_id: number;
    role_name: string;
    role_code: string;
    permission_count: number;
  };
}

/**
 * DTO for role restore operation
 */
export class RestoreRoleDto {
  @IsOptional()
  @IsNumber({}, { message: 'updated_by must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'updated_by must be at least 1' })
  @IsInt({ message: 'updated_by must be an integer' })
  updated_by?: number;
}

/**
 * Response DTO for role deletion
 */
export class DeleteRoleResponseDto {
  status: string;
  message: string;
  data: {
    role_id: number;
    role_name: string;
    role_code: string;
  };

  
}

// ============================================================
// USER PERMISSION CHECK DTOs (ADD THESE - OPTIONAL BUT RECOMMENDED)
// ============================================================

/**
 * Response DTO for checking user module access
 * Used by GET /api/iorole/user/:user_id/check/:module_code
 */
export class UserModuleAccessResponseDto {
  status: string;
  message: string;
  hasAccess: boolean;
  isSuperAdmin?: boolean;
  permissions?: {
    canRead: boolean;
    canWrite: boolean;
    canApprove: boolean;
    canDelete: boolean;
    accessLevel: string;
  };
}

/**
 * Response DTO for getting user module permissions
 * Used by GET /api/iorole/user/:user_id/module/:module_code
 */
export class UserModulePermissionsResponseDto {
  status: string;
  message: string;
  can_read: boolean;
  can_write: boolean;
  can_approve: boolean;
  can_delete: boolean;
  access_level: string;
  module_name?: string;
  module_code?: string;
  isSuperAdmin?: boolean;
}

/**
 * DTO for individual user permission
 */
export class UserPermissionDto {
  permission_id: number;
  module_name: string;
  module_code: string;
  description?: string;
  display_order?: number;
  can_read: number;
  can_write: number;
  can_approve: number;
  can_delete: number;
  access_level: string;
}

/**
 * Response DTO for getting all user permissions
 * Used by GET /api/iorole/user/:user_id/all-permissions
 */
export class AllUserPermissionsResponseDto {
  status: string;
  message: string;
  isSuperAdmin: boolean;
  permissions: UserPermissionDto[];
}

/**
 * Response DTO for checking Super Admin status
 * Used by GET /api/iorole/user/:user_id/is-super-admin
 */
export class SuperAdminCheckResponseDto {
  status: string;
  message: string;
  isSuperAdmin: boolean;
}

/**
 * DTO for accessible menu item
 */
export class AccessibleMenuDto {
  module_code: string;
  module_name: string;
  can_read: boolean;
  can_write: boolean;
  can_approve: boolean;
  can_delete: boolean;
}

/**
 * Response DTO for getting user accessible menus
 * Used by GET /api/iorole/user/:user_id/accessible-menus
 */
export class UserAccessibleMenusResponseDto {
  status: string;
  message: string;
  isSuperAdmin: boolean;
  menus: AccessibleMenuDto[];
}

/**
 * Response DTO for user permission errors
 */
export class UserPermissionErrorResponseDto {
  status: string;
  message: string;
  error?: string;
}