import { Repository } from 'typeorm';
import { KdBook } from '../entity/kd_book.entity';
export declare class PickupService {
    private readonly bookRepository;
    constructor(bookRepository: Repository<KdBook>);
    findNearbyBookings(lat: number, lon: number): Promise<any>;
}
