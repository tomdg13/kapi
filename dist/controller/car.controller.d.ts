import { CarService } from '../service/car.service';
import { CarDto } from '../dto/car.dto';
export declare class CarController {
    private readonly carService;
    constructor(carService: CarService);
    getCarByDriverId(dto: CarDto): Promise<any>;
    findCar(CarDto: CarDto): Promise<any>;
    addCar(body: any): Promise<{
        status: string;
        message: string;
        car_id?: number;
    }>;
    updateCar(body: any): Promise<{
        status: string;
        message: string;
    }>;
}
