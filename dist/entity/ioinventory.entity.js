"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoInventory = exports.CurrencyPrimary = exports.InventoryStatus = void 0;
const typeorm_1 = require("typeorm");
var InventoryStatus;
(function (InventoryStatus) {
    InventoryStatus["ACTIVE"] = "active";
    InventoryStatus["INACTIVE"] = "inactive";
    InventoryStatus["BLOCKED"] = "blocked";
    InventoryStatus["RESERVED"] = "reserved";
    InventoryStatus["EXPIRED"] = "expired";
})(InventoryStatus || (exports.InventoryStatus = InventoryStatus = {}));
var CurrencyPrimary;
(function (CurrencyPrimary) {
    CurrencyPrimary["LAK"] = "LAK";
    CurrencyPrimary["THB"] = "THB";
    CurrencyPrimary["USD"] = "USD";
})(CurrencyPrimary || (exports.CurrencyPrimary = CurrencyPrimary = {}));
let IoInventory = class IoInventory {
    get expiryStatus() {
        if (!this.expire_date)
            return 'good';
        const today = new Date();
        const expireDate = new Date(this.expire_date);
        const daysUntilExpiry = Math.ceil((expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry < 0)
            return 'expired';
        if (daysUntilExpiry <= 30)
            return 'expiring_soon';
        return 'good';
    }
    canReserve(quantity) {
        return this.available_quantity >= quantity && this.status === InventoryStatus.ACTIVE;
    }
    canIssue(quantity) {
        return this.available_quantity >= quantity &&
            this.status === InventoryStatus.ACTIVE &&
            this.expiryStatus !== 'expired';
    }
    getProfitMarginLAK() {
        if (!this.cost_price_lak || !this.unit_price_lak)
            return 0;
        return ((this.unit_price_lak - this.cost_price_lak) / this.cost_price_lak) * 100;
    }
    getProfitMarginTHB() {
        if (!this.cost_price_thb || !this.unit_price_thb)
            return 0;
        return ((this.unit_price_thb - this.cost_price_thb) / this.cost_price_thb) * 100;
    }
};
exports.IoInventory = IoInventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IoInventory.prototype, "inventory_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], IoInventory.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], IoInventory.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], IoInventory.prototype, "reserved_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], IoInventory.prototype, "available_quantity", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], IoInventory.prototype, "last_updated", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], IoInventory.prototype, "created_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], IoInventory.prototype, "stock_in_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], IoInventory.prototype, "stock_out_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], IoInventory.prototype, "expire_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], IoInventory.prototype, "block_location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IoInventory.prototype, "cost_price_lak", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IoInventory.prototype, "cost_price_thb", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IoInventory.prototype, "unit_price_lak", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], IoInventory.prototype, "unit_price_thb", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CurrencyPrimary,
        default: CurrencyPrimary.LAK,
        nullable: true,
    }),
    __metadata("design:type", String)
], IoInventory.prototype, "currency_primary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], IoInventory.prototype, "batch_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], IoInventory.prototype, "supplier_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InventoryStatus,
        default: InventoryStatus.ACTIVE,
        nullable: false,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], IoInventory.prototype, "status", void 0);
exports.IoInventory = IoInventory = __decorate([
    (0, typeorm_1.Entity)('io_inventory'),
    (0, typeorm_1.Index)(['product_id', 'location_id'], { unique: false }),
    (0, typeorm_1.Index)(['location_id']),
    (0, typeorm_1.Index)(['supplier_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['expire_date']),
    (0, typeorm_1.Index)(['batch_number'])
], IoInventory);
//# sourceMappingURL=ioinventory.entity.js.map