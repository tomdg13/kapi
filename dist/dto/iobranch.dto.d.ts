export declare class CreateIobranchDto {
    company_id: number;
    branch_name: string;
    branch_code: string;
    province_name?: string;
    address?: string;
    phone?: string;
    email?: string;
    manager_name?: string;
    image?: string;
}
export declare class UpdateIobranchDto {
    company_id?: number;
    branch_name?: string;
    branch_code?: string;
    province_name?: string;
    address?: string;
    phone?: string;
    email?: string;
    manager_name?: string;
    image?: string;
}
export declare class IobranchDto {
    status?: string;
    company_id?: number;
}
export declare class FindbranchByIdDto {
    id: number;
}
