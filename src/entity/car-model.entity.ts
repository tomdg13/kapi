import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('car_model')
export class CarModelEntity {
  @PrimaryGeneratedColumn()
  model_id: number;

  @Column()
  brand_id: number;

  @Column({ nullable: true })
  car_type_id: number;

  @Column()
  model_name: string;

  @Column({ default: 1 })
  is_active: number;
}
