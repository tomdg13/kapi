import { DataSource } from 'typeorm';
import { UpdateRolePermissionsDto, BulkAccessLevelDto } from '../dto/permission.dto';
export declare class PermissionService {
    private dataSource;
    constructor(dataSource: DataSource);
    getPermissions(): Promise<any>;
    getRolePermissions(roleId: number): Promise<any>;
    updateRolePermissions(roleId: number, dto: UpdateRolePermissionsDto): Promise<any>;
    updateAccessLevels(roleId: number, dto: BulkAccessLevelDto): Promise<any>;
    checkUserPermission(userId: number, moduleCode: string, action: string): Promise<boolean>;
    getUserPermissions(userId: number): Promise<any>;
}
