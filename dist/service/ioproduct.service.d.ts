import { IoProductDto, FindProductByIdDto } from 'src/dto/ioproduct.dto';
import { DataSource } from 'typeorm';
export declare class IoProductService {
    private dataSource;
    constructor(dataSource: DataSource);
    findProductById(dto: FindProductByIdDto): Promise<any>;
    findProductByBarcode(barcode: string): Promise<any>;
    findProductsByStatus(dto: IoProductDto): Promise<any>;
    addProductWithImage(productDto: any): Promise<{
        status: string;
        message: string;
    }>;
    updateProductWithImage(productId: number, productDto: any): Promise<{
        status: string;
        message: string;
    }>;
    deleteProduct(productId: number): Promise<{
        status: string;
        message: string;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
}
