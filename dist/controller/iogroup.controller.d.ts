import { IoGroupService } from 'src/service/iogroup.service';
import { CreateIogroupDto, UpdateIogroupDto, IogroupDto } from 'src/dto/iogroup.dto';
export declare class IoGroupController {
    private readonly ioGroupService;
    constructor(ioGroupService: IoGroupService);
    findGroupById(id: number): Promise<any>;
    findGroupsByStatus(query: IogroupDto): Promise<any>;
    createGroup(createGroupDto: CreateIogroupDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateGroup(id: number, updateGroupDto: UpdateIogroupDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteGroup(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
