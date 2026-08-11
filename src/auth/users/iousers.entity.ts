import { Entity, Column, } from 'typeorm';

@Entity('io_user')
export class IOUser {
  @Column()
  userName: string;

  @Column()
  password: string;
}