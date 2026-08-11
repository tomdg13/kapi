import { DataSource } from 'typeorm';
import { UpdateBannerStatusDto } from 'src/dto/update-banner-status.dto';
export declare class BannerService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    updateBannerStatus(id: number, statusDto: UpdateBannerStatusDto): Promise<{
        status: string;
        message: string;
    }>;
}
