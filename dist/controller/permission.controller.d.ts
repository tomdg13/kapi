import { PermissionService } from '../service/permission.service';
import { UpdateRolePermissionsDto, BulkAccessLevelDto, CheckPermissionDto } from '../dto/permission.dto';
export declare class PermissionController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    getPermissions(): Promise<any>;
    getRolePermissions(roleId: number): Promise<any>;
    updateRolePermissions(roleId: number, dto: UpdateRolePermissionsDto): Promise<any>;
    updateAccessLevels(roleId: number, dto: BulkAccessLevelDto): Promise<any>;
    checkPermission(dto: CheckPermissionDto, req: any): Promise<{
        status: string;
        data: {
            has_permission: boolean;
            module_code: string;
            action: string;
        };
    }>;
    getMyPermissions(req: any): Promise<any>;
}
