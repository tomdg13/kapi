import { IoLocationDto, IoProductDto, IoTerminalDto } from '../dto/ioview.dto';
import { IoViewService } from '../service/ioview.service';
export declare class IoViewController {
    private readonly ioViewService;
    constructor(ioViewService: IoViewService);
    getLocations(dto: IoLocationDto): Promise<any>;
    getProducts(dto: IoProductDto): Promise<any>;
    getTerminals(dto: IoTerminalDto): Promise<any>;
}
