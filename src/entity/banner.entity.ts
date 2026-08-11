import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('kd_banner')
export class Banner {
  @PrimaryGeneratedColumn({ name: 'banner_id' })
  bannerId: number;

  @Column({ name: 'banner_note', type: 'varchar', length: 255, nullable: true })
  bannerNote: string;

  @Column({ name: 'banner_photo', type: 'varchar', length: 255, nullable: true })
  bannerPhoto: string;

  @Column({ name: 'banner_index', type: 'varchar', length: 10, nullable: true })
  bannerIndex: string;

  @Column({ name: 'banner_status', type: 'varchar', length: 20, default: 'inactive' })
  bannerStatus: string;

  @Column({ name: 'banner_link', type: 'varchar', length: 255, nullable: true })
  bannerLink: string;
}
