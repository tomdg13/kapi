import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UpdateBannerStatusDto } from 'src/dto/update-banner-status.dto';

@Injectable()
export class BannerService {
  constructor(private readonly dataSource: DataSource) {}

  async updateBannerStatus(
    id: number,
    statusDto: UpdateBannerStatusDto,
  ): Promise<{ status: string; message: string }> {
    try {
      const { banner_status } = statusDto;

      const sql = `UPDATE kd_banner SET banner_status = ? WHERE banner_id = ?`;
      const values = [banner_status, id];

      await this.dataSource.query(sql, values);

      return {
        status: 'success',
        message: 'Banner status updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update banner status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
//20250811