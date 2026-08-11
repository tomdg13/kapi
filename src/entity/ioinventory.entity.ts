import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export enum InventoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  RESERVED = 'reserved',
  EXPIRED = 'expired',
}

export enum CurrencyPrimary {
  LAK = 'LAK',
  THB = 'THB',
  USD = 'USD',
}

@Entity('io_inventory')
@Index(['product_id', 'location_id'], { unique: false })
@Index(['location_id'])
@Index(['supplier_id'])
@Index(['status'])
@Index(['expire_date'])
@Index(['batch_number'])
export class IoInventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @Column({ type: 'int', nullable: false })
  @Index()
  product_id: number;

  @Column({ type: 'int', nullable: false })
  @Index()
  location_id: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  reserved_quantity: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  available_quantity: number;

  @UpdateDateColumn({ type: 'timestamp' })
  last_updated: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @Column({ type: 'int', nullable: true, default: 0 })
  stock_in_quantity: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  stock_out_quantity: number;

  @Column({ type: 'date', nullable: true })
  @Index()
  expire_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  block_location: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  cost_price_lak: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cost_price_thb: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  unit_price_lak: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  unit_price_thb: number;

  @Column({
    type: 'enum',
    enum: CurrencyPrimary,
    default: CurrencyPrimary.LAK,
    nullable: true,
  })
  currency_primary: CurrencyPrimary;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index()
  batch_number: string;

  @Column({ type: 'int', nullable: true })
  @Index()
  supplier_id: number;

  @Column({
    type: 'enum',
    enum: InventoryStatus,
    default: InventoryStatus.ACTIVE,
    nullable: false,
  })
  @Index()
  status: InventoryStatus;

  // Getter for expiry status
  get expiryStatus(): 'expired' | 'expiring_soon' | 'good' {
    if (!this.expire_date) return 'good';
    
    const today = new Date();
    const expireDate = new Date(this.expire_date);
    const daysUntilExpiry = Math.ceil((expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring_soon';
    return 'good';
  }

  // Method to check if item can be reserved
  canReserve(quantity: number): boolean {
    return this.available_quantity >= quantity && this.status === InventoryStatus.ACTIVE;
  }

  // Method to check if item can be sold/issued
  canIssue(quantity: number): boolean {
    return this.available_quantity >= quantity && 
           this.status === InventoryStatus.ACTIVE && 
           this.expiryStatus !== 'expired';
  }

  // Calculate profit margin in LAK
  getProfitMarginLAK(): number {
    if (!this.cost_price_lak || !this.unit_price_lak) return 0;
    return ((this.unit_price_lak - this.cost_price_lak) / this.cost_price_lak) * 100;
  }

  // Calculate profit margin in THB
  getProfitMarginTHB(): number {
    if (!this.cost_price_thb || !this.unit_price_thb) return 0;
    return ((this.unit_price_thb - this.cost_price_thb) / this.cost_price_thb) * 100;
  }
}