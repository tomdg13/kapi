import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('kd_advertising')
export class Advertising {
  @PrimaryGeneratedColumn({ name: 'advertising_id' })
  advertisingId: number;

  @Column({ name: 'advertising_note', type: 'varchar', length: 255, nullable: true })
  advertisingNote: string;

  @Column({ name: 'advertising_photo', type: 'varchar', length: 255, nullable: true })
  advertisingPhoto: string;

  @Column({ name: 'advertising_index', type: 'varchar', length: 10, nullable: true })
  advertisingIndex: string;

  @Column({ name: 'advertising_status', type: 'varchar', length: 20, default: 'inactive' })
  advertisingStatus: string;

  @Column({ name: 'advertising_link', type: 'varchar', length: 255, nullable: true })
  advertisingLink: string;
}
