export declare class GetRolesDto {
    status?: string;
    company_id?: number;
}
export declare class CreateRoleDto {
    role_name: string;
    role_code: string;
    description?: string;
    company_id: number;
    level?: number;
    permissions?: any;
    status?: string;
    is_system?: boolean;
    created_by?: number;
}
export declare class UpdateRoleDto {
    role_name?: string;
    description?: string;
    level?: number;
    permissions?: any;
    status?: string;
    updated_by?: number;
}
export declare class GetRoleByCodeDto {
    company_id?: number;
}
export declare class RoleResponseDto {
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
export declare class RoleListResponseDto {
    status: string;
    message: string;
    data: RoleResponseDto[];
}
export declare class SingleRoleResponseDto {
    status: string;
    message: string;
    data: RoleResponseDto | null;
}
export declare class SuccessResponseDto {
    status: string;
    message: string;
    data?: any;
}
export declare class ErrorResponseDto {
    status: string;
    message: string;
    error?: string;
    statusCode?: number;
    errors?: string[];
}
export declare class NotFoundResponseDto {
    status: string;
    message: string;
    data: null;
}
export declare class ConflictResponseDto {
    status: string;
    message: string;
    existing_role?: string;
    user_count?: number;
    role_name?: string;
}
export declare class ForbiddenResponseDto {
    status: string;
    message: string;
    role_name?: string;
}
export declare class RoleStatsDto {
    total_roles: number;
    active_roles: number;
    inactive_roles: number;
    system_roles: number;
    company_roles: number;
    total_users: number;
}
export declare class RoleWithUserCountDto {
    role_id: number;
    role_name: string;
    role_code: string;
    level: number;
    status: string;
    is_system: boolean;
    company_id: number;
    user_count: number;
}
export declare class RoleWithUserCountResponseDto {
    status: string;
    message: string;
    data: RoleWithUserCountDto[];
}
export declare class UpdateRolePermissionsDto {
    permission_ids: number[];
    updated_by?: number;
}
export declare class AddRolePermissionsDto {
    permission_ids: number[];
    created_by?: number;
}
export declare class RemoveRolePermissionsDto {
    permission_ids: number[];
}
export declare class CopyRolePermissionsDto {
    source_role_id: number;
    replace?: boolean;
    created_by?: number;
}
export declare class PermissionResponseDto {
    permission_id: number;
    module_name: string;
    module_code: string;
    description?: string;
    display_order: number;
    is_active: boolean;
    assigned_at?: Date;
}
export declare class RolePermissionsResponseDto {
    status: string;
    message: string;
    data: PermissionResponseDto[];
    role: {
        role_id: number;
        role_name: string;
    };
}
export declare class UpdatePermissionsResponseDto {
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
export declare class PermissionErrorResponseDto {
    status: string;
    message: string;
    invalid_ids?: number[];
    role_name?: string;
    error?: string;
}
export declare class ValidatePermissionIdsDto {
    permission_ids: number[];
}
export declare class PermissionValidationResponseDto {
    valid: boolean;
    valid_ids: number[];
    invalid_ids: number[];
    message: string;
}
export declare class BulkAssignPermissionsDto {
    role_ids: number[];
    permission_ids: number[];
    replace?: boolean;
    updated_by?: number;
}
export declare class BulkOperationResponseDto {
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
export declare class RolePermissionSummaryDto {
    role_id: number;
    role_name: string;
    role_code: string;
    company_id: number;
    permission_count: number;
    permissions: PermissionResponseDto[];
    last_updated?: Date;
}
export declare class MultipleRolePermissionsResponseDto {
    status: string;
    message: string;
    data: RolePermissionSummaryDto[];
}
export declare class CreateRoleWithPermissionsDto extends CreateRoleDto {
    permission_ids?: number[];
}
export declare class CreateRoleWithPermissionsResponseDto {
    status: string;
    message: string;
    data: {
        role_id: number;
        role_name: string;
        role_code: string;
        permission_count: number;
    };
}
export declare class RestoreRoleDto {
    updated_by?: number;
}
export declare class DeleteRoleResponseDto {
    status: string;
    message: string;
    data: {
        role_id: number;
        role_name: string;
        role_code: string;
    };
}
export declare class UserModuleAccessResponseDto {
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
export declare class UserModulePermissionsResponseDto {
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
export declare class UserPermissionDto {
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
export declare class AllUserPermissionsResponseDto {
    status: string;
    message: string;
    isSuperAdmin: boolean;
    permissions: UserPermissionDto[];
}
export declare class SuperAdminCheckResponseDto {
    status: string;
    message: string;
    isSuperAdmin: boolean;
}
export declare class AccessibleMenuDto {
    module_code: string;
    module_name: string;
    can_read: boolean;
    can_write: boolean;
    can_approve: boolean;
    can_delete: boolean;
}
export declare class UserAccessibleMenusResponseDto {
    status: string;
    message: string;
    isSuperAdmin: boolean;
    menus: AccessibleMenuDto[];
}
export declare class UserPermissionErrorResponseDto {
    status: string;
    message: string;
    error?: string;
}
