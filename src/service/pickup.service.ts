// src/service/pickup.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KdBook } from '../entity/kd_book.entity'; // adjust the path if needed

@Injectable()
export class PickupService {
  constructor(
    @InjectRepository(KdBook)
    private readonly bookRepository: Repository<KdBook>,
  ) {}

  async findNearbyBookings(lat: number, lon: number) {
    // Get parameter values from kd_parameter table
    const [distanceParam] = await this.bookRepository.query(
      `SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer long km' LIMIT 1`
    );
    const [limitParam] = await this.bookRepository.query(
      `SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer count km' LIMIT 1`
    );
    const [timeParam] = await this.bookRepository.query(
      `SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer minute' LIMIT 1`
    );

    // Safely parse parameters with fallback values
    const maxDistance = parseFloat(distanceParam?.setup ?? '5'); // in km
    const maxCount = parseInt(limitParam?.setup ?? '10');        // number of results
    const maxTimeSeconds = parseInt(timeParam?.setup ?? '5') * 60; // convert minutes to seconds

    return this.bookRepository.query(
      `
      SELECT kd_book.*,
        kd_customer.name AS passenger_name,
        kd_customer.phone AS passenger_phone, 
        (6371 * acos(
          cos(radians(?)) * cos(radians(pickup_lat)) *
          cos(radians(pickup_lon) - radians(?)) +
          sin(radians(?)) * sin(radians(pickup_lat))
        )) AS distance,
        TIMESTAMPDIFF(SECOND, request_time, NOW()) AS seconds_ago
      FROM kd_book
      LEFT JOIN kd_customer ON kd_book.passenger_id = kd_customer.customer_id
      WHERE driver_id IS NULL 
        AND pickup_lat IS NOT NULL 
        AND pickup_lon IS NOT NULL
        AND request_time >= NOW() - INTERVAL ? SECOND
      HAVING distance <= ?
      ORDER BY distance ASC
      LIMIT ?
      `,
      [lat, lon, lat, maxTimeSeconds, maxDistance, maxCount]
    );
  }


//  async getAllParameters() {
//     return this.bookRepository.query(
//       `SELECT parameter, setup FROM kd_parameter ORDER BY parameter ASC`
//     );
//   }

}
