import { CarDto } from 'src/dto/car.dto';
import { DataSource } from 'typeorm';
export declare class CarService {
    private dataSource;
    constructor(dataSource: DataSource);
    findCarByDriverId(dto: CarDto): Promise<any>;
    findCar(dto: CarDto): Promise<any>;
    addCar(carDto: any): Promise<{
        status: string;
        message: string;
        car_id?: number;
    }>;
    private saveImage;
    private parseBase64Image;
    private getFileExtension;
    updateCar(carDto: any): Promise<{
        status: string;
        message: string;
    }>;
}
