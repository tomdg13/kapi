import { DataSource } from 'typeorm';
export declare class DriverService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    updateDriverOnlineStatus(phone: string, onlineStatus: string): Promise<{
        status: string;
        message: string;
    }>;
}
