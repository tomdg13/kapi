import { IouserDto } from 'src/dto/iouser.dto';
import { DataSource } from 'typeorm';
export declare class iouserService {
    private dataSource;
    constructor(dataSource: DataSource);
    findIouserById(dto: IouserDto): Promise<any>;
    findIousersByCompany(company_id: number): Promise<any>;
    searchUsers(searchParams: {
        company_id?: number;
        role_id?: number;
        role_code?: string;
        status?: string;
        search_text?: string;
    }): Promise<any>;
    findIousersByRole(dto: IouserDto): Promise<any>;
    private validateRoleId;
    private getRoleIdByCode;
    addIouserWithPhoto(iouserDto: any): Promise<{
        status: string;
        message: string;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updateIouserWithPhoto(phone: string, iouserDto: any): Promise<{
        status: string;
        message: string;
    }>;
}
