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
exports.Advertising = void 0;
const typeorm_1 = require("typeorm");
let Advertising = class Advertising {
};
exports.Advertising = Advertising;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'advertising_id' }),
    __metadata("design:type", Number)
], Advertising.prototype, "advertisingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'advertising_note', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Advertising.prototype, "advertisingNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'advertising_photo', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Advertising.prototype, "advertisingPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'advertising_index', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], Advertising.prototype, "advertisingIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'advertising_status', type: 'varchar', length: 20, default: 'inactive' }),
    __metadata("design:type", String)
], Advertising.prototype, "advertisingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'advertising_link', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Advertising.prototype, "advertisingLink", void 0);
exports.Advertising = Advertising = __decorate([
    (0, typeorm_1.Entity)('kd_advertising')
], Advertising);
//# sourceMappingURL=advertising.entity.js.map