import { IobranchService } from 'src/service/iobranch.service';
import { CreateIobranchDto, UpdateIobranchDto, IobranchDto } from 'src/dto/iobranch.dto';
export declare class IobranchController {
    private readonly iobranchService;
    constructor(iobranchService: IobranchService);
    findBranchesByStatus(query: IobranchDto): Promise<any>;
    findBranchById(id: number): Promise<any>;
    createBranch(createBranchDto: CreateIobranchDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateBranch(id: number, updateBranchDto: UpdateIobranchDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteBranch(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
