// src/service/driver.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DriverService {
  constructor(private readonly dataSource: DataSource) {}

  async updateDriverOnlineStatus(phone: string, onlineStatus: string): Promise<{ status: string; message: string }> {
    try {
      if (!['Online', 'Offline'].includes(onlineStatus)) {
        throw new Error('Invalid status value. Must be Online or Offline');
      }

      const result = await this.dataSource.query(
        `UPDATE kd_driver SET Online = ? WHERE phone = ?`,
        [onlineStatus, phone]
      );

      if (result.affectedRows === 0 || result.affected === 0) {
        throw new Error('Driver not found or no change');
      }

      return {
        status: 'success',
        message: `Driver Online updated to ${onlineStatus}`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update driver Online',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}



// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { DataSource } from 'typeorm';


// @Injectable()
// export class DriverService {
//   constructor(private readonly dataSource: DataSource) {}

//   async updateDriverOnlineStatus(phone: string, onlineStatus: string): Promise<{ status: string; message: string }> {
//     try {
//       // Optional: Validate input
//       if (!['Online', 'Offline'].includes(onlineStatus)) {
//         throw new Error('Invalid status value. Must be Online or Offline');
//       }

//       const result = await this.dataSource.query(
//         `UPDATE kd_driver SET Online = ? WHERE phone = ?`,
//         [onlineStatus, phone]
//       );

//       if (result.affectedRows === 0 || result.affected === 0) {
//         throw new Error('Driver not found or no change');
//       }

//       return {
//         status: 'success',
//         message: `Driver Online updated to ${onlineStatus}`,
//       };
//     } catch (error) {
//       console.error('❌ Error updating driver Online:', error.message);
//       throw new HttpException(
//         {
//           status: 'error',
//           message: 'Failed to update driver Online',
//           error: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

// // book.service.ts
// async findNearbyBookings(lat: number, lon: number) {
//   return this.bookRepository.query(
//     `
//     SELECT *,
//       (6371 * acos(
//         cos(radians(?)) * cos(radians(pickup_lat)) *
//         cos(radians(pickup_lon) - radians(?)) +
//         sin(radians(?)) * sin(radians(pickup_lat))
//       )) AS distance
//     FROM kd_book
//     HAVING distance <= 5
//     ORDER BY distance ASC
//     `,
//     [lat, lon, lat]
//   );
// }






// }
