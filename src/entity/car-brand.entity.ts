import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('car_brand')
export class CarBrandEntity {
  @PrimaryGeneratedColumn()
  brand_id: number;

  @Column()
  brand_name: string;

  @Column({ default: 1 })
  is_active: number;
}
