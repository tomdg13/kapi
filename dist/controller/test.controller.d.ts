import { testService } from 'src/service/test.service';
import { TesttDto } from 'src/dto/test.dto';
export declare class TestController {
    private readonly TestService;
    constructor(TestService: testService);
    find(testDto: TesttDto): Promise<any>;
}
