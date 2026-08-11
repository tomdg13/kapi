import { iouserService } from 'src/service/iouser.service';
import { IouserDto } from 'src/dto/iouser.dto';
export declare class ProvinceIdDto {
    pr_id: number;
}
export declare class IouserController {
    private readonly iouserService;
    constructor(iouserService: iouserService);
    findById(iouserDto: IouserDto): Promise<any>;
    findByRole(iouserDto: IouserDto): Promise<any>;
    addUser(body: any): Promise<{
        status: string;
        message: string;
    }>;
    updateIouser(phone: string, iouserDto: any): Promise<{
        status: string;
        message: string;
    }>;
}
