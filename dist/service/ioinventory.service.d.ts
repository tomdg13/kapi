import { DataSource } from 'typeorm';
import { CreateInventoryDto } from '../dto/ioinventory.dto';
export declare class IoInventoryService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createInventory(inventoryDto: CreateInventoryDto): Promise<{
        status: string;
        message: string;
        inventory_id?: number;
    }>;
    getInventoryByCompany(companyId: number): Promise<any>;
    getInventoryBStocklow(companyId: number): Promise<any>;
    getInventoryByExpire(companyId: number): Promise<any>;
}
