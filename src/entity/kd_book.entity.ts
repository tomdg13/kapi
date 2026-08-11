// src/entity/kd_book.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kd_book')
export class KdBook {
  @PrimaryGeneratedColumn()
  book_id: number;

  @Column()
  passenger_id: string;

  @Column({ nullable: true })
  driver_id: string;

  @Column({ nullable: true })
  car_id: string;

  @Column()
  request_time: Date;

  @Column('float')
  pickup_lat: number;

  @Column('float')
  pickup_lon: number;

  @Column('float')
  dropoff_lat: number;

  @Column('float')
  dropoff_lon: number;

  @Column()
  prickup: string;

  @Column()
  dropoff: string;

  @Column({ nullable: true })
  start_time: Date;

  @Column({ nullable: true })
  end_time: Date;

  @Column('float')
  suggeste_price: number;

  @Column('float')
  payment_price: number;

  @Column()
  book_status: string;

  @Column({ nullable: true })
  review: string;
}
