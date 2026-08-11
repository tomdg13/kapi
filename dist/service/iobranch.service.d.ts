import { IobranchDto, FindbranchByIdDto } from 'src/dto/iobranch.dto';
import { DataSource } from 'typeorm';
export declare class IobranchService {
    private dataSource;
    constructor(dataSource: DataSource);
    findbranchById(dto: FindbranchByIdDto): Promise<any>;
    findbranchsByStatus(dto: IobranchDto): Promise<any>;
    addbranchWithImage(branchDto: any): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updatebranchWithImage(branchId: number, branchDto: any): Promise<{
        status: string;
        message: string;
    }>;
    deletebranch(branchId: number): Promise<{
        status: string;
        message: string;
    }>;
}
