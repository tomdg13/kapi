import { DataSource } from 'typeorm';
import { TesttDto } from 'src/dto/test.dto';
export declare class testService {
    private dataSource;
    constructor(dataSource: DataSource);
    find(TesttDto: TesttDto): Promise<any>;
}
