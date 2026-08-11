import { DataSource } from 'typeorm';
interface IoLocationDto {
    company_id: number;
}
interface IoProductDto {
    company_id: number;
}
interface IoTerminalDto {
    company_id: number;
}
export declare class IoViewService {
    private dataSource;
    constructor(dataSource: DataSource);
    findLocations(dto: IoLocationDto): Promise<any>;
    findProducts(dto: IoProductDto): Promise<any>;
    findTerminals(dto: IoTerminalDto): Promise<any>;
}
export {};
