import { DataSource } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from '../dto/iorole.dto';
export declare class IoroleService {
    private dataSource;
    constructor(dataSource: DataSource);
    getRoles(status?: string, company_id?: number): Promise<any>;
    getRoleById(role_id: number): Promise<any>;
    getRoleByCode(role_code: string, company_id?: number): Promise<any>;
    createRole(roleData: CreateRoleDto): Promise<any>;
    updateRole(role_id: number, roleData: UpdateRoleDto): Promise<any>;
    deleteRole(role_id: number): Promise<any>;
    hardDeleteRole(role_id: number): Promise<any>;
    restoreRole(role_id: number): Promise<any>;
    getRolesWithUserCount(company_id?: number): Promise<any>;
    getRolePermissions(role_id: number): Promise<any>;
    updateRolePermissions(role_id: number, permission_ids: number[]): Promise<any>;
    addPermissionsToRole(role_id: number, permission_ids: number[]): Promise<any>;
    removePermissionsFromRole(role_id: number, permission_ids: number[]): Promise<any>;
    copyRolePermissions(source_role_id: number, target_role_id: number, replace?: boolean): Promise<any>;
    checkUserModuleAccess(user_id: number, module_code: string): Promise<any>;
    getUserModulePermissions(user_id: number, module_code: string): Promise<any>;
    getAllUserPermissions(user_id: number): Promise<any>;
    checkIsSuperAdmin(user_id: number): Promise<any>;
    getUserAccessibleMenus(user_id: number): Promise<any>;
}
