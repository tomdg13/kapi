import { DriverService } from '../service/driver.service';
import { PickupService } from '../service/pickup.service';
export declare class DriverController {
    private readonly driverService;
    private readonly pickupService;
    constructor(driverService: DriverService, pickupService: PickupService);
    updateDriverStatus(body: {
        phone: string;
        online: string;
    }): Promise<{
        status: string;
        message: string;
    }>;
    getNearbyBookings(body: {
        lat: number;
        lon: number;
    }): Promise<any>;
}
