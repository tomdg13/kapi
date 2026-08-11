import { IoroleService } from '../service/iorole.service';
export declare class IoroleController {
    private readonly ioroleService;
    constructor(ioroleService: IoroleService);
    getRoles(status?: string, company_id?: string): Promise<any>;
    getRolesWithUserCount(company_id?: string): Promise<any>;
    getRoleByCode(code: string, company_id?: string): Promise<any>;
    getRoleById(id: number): Promise<any>;
    createRole(roleData: any): Promise<any>;
    updateRole(id: number, roleData: any): Promise<any>;
    deleteRole(id: number): Promise<any>;
    hardDeleteRole(id: number): Promise<any>;
    restoreRole(id: number): Promise<any>;
    getRolePermissions(id: number): Promise<any>;
    updateRolePermissions(id: number, body: {
        permission_ids: number[];
    }): Promise<any>;
    addPermissionsToRole(id: number, body: {
        permission_ids: number[];
    }): Promise<any>;
    removePermissionsFromRole(id: number, body: {
        permission_ids: number[];
    }): Promise<any>;
    copyRolePermissions(target_role_id: number, body: {
        source_role_id: number;
        replace?: boolean;
    }): Promise<any>;
    checkUserModuleAccess(user_id: number, module_code: string): Promise<any>;
    getUserModulePermissions(user_id: number, module_code: string): Promise<any>;
    getAllUserPermissions(user_id: number): Promise<any>;
    checkIsSuperAdmin(user_id: number): Promise<any>;
    getUserAccessibleMenus(user_id: number): Promise<any>;
}
