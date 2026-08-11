import { IoProductService } from 'src/service/ioproduct.service';
import { CreateIoProductDto, UpdateIoProductDto, IoProductDto } from 'src/dto/ioproduct.dto';
export declare class IoProductController {
    private readonly ioProductService;
    constructor(ioProductService: IoProductService);
    findProductByBarcode(barcode: string): Promise<any>;
    findProductById(id: number): Promise<any>;
    findProductsByStatus(query: IoProductDto): Promise<any>;
    createProduct(createProductDto: CreateIoProductDto): Promise<{
        status: string;
        message: string;
    }>;
    updateProduct(id: number, updateProductDto: UpdateIoProductDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteProduct(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
