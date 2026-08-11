import { IoInventoryService } from '../service/ioinventory.service';
import { CreateInventoryDto } from '../dto/ioinventory.dto';
export declare class IoInventoryController {
    private readonly ioInventoryService;
    constructor(ioInventoryService: IoInventoryService);
    createInventory(createInventoryDto: CreateInventoryDto): Promise<{
        status: string;
        message: string;
        inventory_id?: number;
    }>;
    getInventoryByCompany(companyId: number): Promise<any>;
    getInventoryBStocklow(companyId: number): Promise<any>;
    getInventoryByExpire(companyId: number): Promise<any>;
}
