export declare class PermissionDto {
    permission_id: number;
    module_name: string;
    module_code: string;
    description?: string;
}
export declare class RolePermissionDto {
    permission_id: number;
    can_read?: boolean;
    can_write?: boolean;
    can_approve?: boolean;
    can_delete?: boolean;
    access_level?: string;
}
export declare class UpdateRolePermissionsDto {
    permissions: RolePermissionDto[];
}
export declare class CheckPermissionDto {
    module_code: string;
    action: string;
}
export declare class AccessLevelDto {
    permission_id: number;
    access_level: string;
}
export declare class BulkAccessLevelDto {
    access_levels: AccessLevelDto[];
}
