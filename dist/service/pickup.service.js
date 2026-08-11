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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const kd_book_entity_1 = require("../entity/kd_book.entity");
let PickupService = class PickupService {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async findNearbyBookings(lat, lon) {
        const [distanceParam] = await this.bookRepository.query(`SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer long km' LIMIT 1`);
        const [limitParam] = await this.bookRepository.query(`SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer count km' LIMIT 1`);
        const [timeParam] = await this.bookRepository.query(`SELECT setup FROM kd_parameter WHERE parameter = 'pickup customer minute' LIMIT 1`);
        const maxDistance = parseFloat(distanceParam?.setup ?? '5');
        const maxCount = parseInt(limitParam?.setup ?? '10');
        const maxTimeSeconds = parseInt(timeParam?.setup ?? '5') * 60;
        return this.bookRepository.query(`
      SELECT *, 
        (6371 * acos(
          cos(radians(?)) * cos(radians(pickup_lat)) *
          cos(radians(pickup_lon) - radians(?)) +
          sin(radians(?)) * sin(radians(pickup_lat))
        )) AS distance,
        TIMESTAMPDIFF(SECOND, request_time, NOW()) AS seconds_ago
      FROM kd_book
      WHERE driver_id IS NULL 
        AND pickup_lat IS NOT NULL 
        AND pickup_lon IS NOT NULL
        AND request_time >= NOW() - INTERVAL ? SECOND
      HAVING distance <= ?
      ORDER BY distance ASC
      LIMIT ?
      `, [lat, lon, lat, maxTimeSeconds, maxDistance, maxCount]);
    }
};
exports.PickupService = PickupService;
exports.PickupService = PickupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kd_book_entity_1.KdBook)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PickupService);
//# sourceMappingURL=pickup.service.js.map