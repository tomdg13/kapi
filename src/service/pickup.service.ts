// src/service/pickup.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KdBook } from '../entity/kd_book.entity';

@Injectable()
export class PickupService {
  constructor(
    @InjectRepository(KdBook)
    private readonly bookRepository: Repository<KdBook>,
  ) {}

  async findNearbyBookings(lat: number, lon: number, driverUsername?: string) {
    const [distanceParam] = await this.bookRepository.query(
      `SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer long km' LIMIT 1`
    );
    const [limitParam] = await this.bookRepository.query(
      `SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer count km' LIMIT 1`
    );
    const [timeParam] = await this.bookRepository.query(
      `SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer minute' LIMIT 1`
    );

    const maxDistance = parseFloat(distanceParam?.setup ?? '5');
    const maxCount = parseInt(limitParam?.setup ?? '10');
    const maxTimeSeconds = parseInt(timeParam?.setup ?? '5') * 60;

    // kd_car.driver_id stores the driver's username/phone (not kd_driver.customer_id)
    let carTypeId: number | null = null;
    if (driverUsername) {
      const [carRow] = await this.bookRepository.query(
        `SELECT car_type_id FROM kd_car WHERE driver_id = ? AND car_status = 'active' LIMIT 1`,
        [driverUsername],
      );
      carTypeId = carRow?.car_type_id ?? null;
    }

    return this.bookRepository.query(
      `
      SELECT kd_book.*,
        kd_cartype.car_type_la AS car_type_la,
        kd_customer.name AS passenger_name,
        kd_customer.phone AS passenger_phone,
        (6371 * acos(
          cos(radians(?)) * cos(radians(pickup_lat)) *
          cos(radians(pickup_lon) - radians(?)) +
          sin(radians(?)) * sin(radians(pickup_lat))
        )) AS distance,
        TIMESTAMPDIFF(SECOND, request_time, NOW()) AS seconds_ago
      FROM kd_book
      LEFT JOIN kd_cartype ON kd_book.requested_car_type_id = kd_cartype.car_type_id
      LEFT JOIN kd_customer ON kd_book.passenger_id = kd_customer.customer_id
      WHERE driver_id IS NULL
        AND pickup_lat IS NOT NULL
        AND pickup_lon IS NOT NULL
        AND request_time >= NOW() - INTERVAL ? SECOND
        AND (requested_car_type_id IS NULL OR requested_car_type_id = ?)
      HAVING distance <= ?
      ORDER BY distance ASC
      LIMIT ?
      `,
      [lat, lon, lat, maxTimeSeconds, carTypeId, maxDistance, maxCount]
    );
  }

//  async getAllParameters() {
//     return this.bookRepository.query(
//       `SELECT parameter, setup FROM kd_parameter ORDER BY parameter ASC`
//     );
//   }
}
