import { BannerService } from 'src/service/banner.service';
import { UpdateBannerStatusDto } from 'src/dto/update-banner-status.dto';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    updateBannerStatus(id: number, statusDto: UpdateBannerStatusDto): Promise<{
        status: string;
        message: string;
    }>;
}
