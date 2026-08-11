// src/users/driver.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('io_driver')
export class Iuser {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  role: string;

  // add other fields if needed
}


