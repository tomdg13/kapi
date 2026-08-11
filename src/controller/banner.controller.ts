import { Controller, Put, Param, Body, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { BannerService } from 'src/service/banner.service';
import { UpdateBannerStatusDto } from 'src/dto/update-banner-status.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Put(':id/status')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateBannerStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateBannerStatusDto,
  ) {
    return this.bannerService.updateBannerStatus(id, statusDto);
  }
}
