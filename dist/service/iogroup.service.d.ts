import { IogroupDto, FindGroupByIdDto } from 'src/dto/iogroup.dto';
import { DataSource } from 'typeorm';
export declare class IoGroupService {
    private dataSource;
    constructor(dataSource: DataSource);
    findGroupById(dto: FindGroupByIdDto): Promise<any>;
    findGroupsByStatus(dto: IogroupDto): Promise<any>;
    private generateGroupCode;
    addGroupWithImage(groupDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updateGroupWithImage(groupId: number, groupDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteGroup(groupId: number): Promise<{
        status: string;
        message: string;
    }>;
    getGroupStats(companyId?: number): Promise<any>;
}
