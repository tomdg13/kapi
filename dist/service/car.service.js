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
exports.CarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const promises_1 = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
let CarService = class CarService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findCarByDriverId(dto) {
        try {
            const query = `SELECT * FROM kdv_car WHERE driver_id = ?`;
            const result = await this.dataSource.query(query, [dto.driver_id]);
            if (result.length === 0) {
                return {
                    status: 'not_found',
                    message: `Car with driver_id ${dto.driver_id} not found`,
                    data: [],
                };
            }
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/car/`;
            const updatedResult = result.map((car) => ({
                ...car,
                picture1: car.picture1 ? imageBaseUrl + car.picture1 : null,
                picture2: car.picture2 ? imageBaseUrl + car.picture2 : null,
                picture3: car.picture3 ? imageBaseUrl + car.picture3 : null,
                picture_id: car.picture_id ? imageBaseUrl + car.picture_id : null,
            }));
            return {
                status: 'success',
                message: 'Car data fetched successfully',
                data: updatedResult,
            };
        }
        catch (error) {
            console.error('Error fetching car data:', error);
            return {
                status: 'error',
                message: 'Failed to fetch car info',
                error: error.message,
            };
        }
    }
    async findCar(dto) {
        try {
            const query = `SELECT * FROM kdv_car`;
            const result = await this.dataSource.query(query);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/car/`;
            const carsWithPhotos = result.map((car) => ({
                ...car,
                picture1: car.picture1 != null ? imageBaseUrl + car.picture1 : null,
                picture2: car.picture2 != null ? imageBaseUrl + car.picture2 : null,
                picture3: car.picture3 != null ? imageBaseUrl + car.picture3 : null,
                picture_id: car.picture_id != null ? imageBaseUrl + car.picture_id : null,
            }));
            return {
                status: 'success',
                message: 'All cars fetched (role ignored)',
                data: carsWithPhotos,
            };
        }
        catch (error) {
            console.error('Error fetching cars:', error);
            return {
                status: 'error',
                message: 'Failed to fetch cars',
                error: error.message,
            };
        }
    }
    async addCar(carDto) {
        try {
            const { brand, model, picture1, picture2, picture3, picture_id, license_plate, car_province_id, car_type_id, driver_id, insurance_no, insurance_date, car_status, } = carDto;
            const picture1Filename = await this.saveImage(picture1);
            const picture2Filename = await this.saveImage(picture2);
            const picture3Filename = await this.saveImage(picture3);
            const pictureIdFilename = await this.saveImage(picture_id);
            const escapeValue = (value) => {
                if (value === null || value === undefined)
                    return 'NULL';
                return typeof value === 'string'
                    ? `'${value.replace(/'/g, "''")}'`
                    : String(value);
            };
            const sql = `
      INSERT INTO kd_car (
        brand, model, picture1, picture2, picture3, picture_id,
        license_plate, car_province_id, car_type_id, driver_id,
        insurance_no, insurance_date, car_status
      ) VALUES (
        ${escapeValue(brand)},
        ${escapeValue(model)},
        ${escapeValue(picture1Filename)},
        ${escapeValue(picture2Filename)},
        ${escapeValue(picture3Filename)},
        ${escapeValue(pictureIdFilename)},
        ${escapeValue(license_plate)},
        ${escapeValue(car_province_id)},
        ${escapeValue(car_type_id)},
        ${escapeValue(driver_id)},
        ${escapeValue(insurance_no)},
        ${escapeValue(insurance_date)},
        ${escapeValue(car_status || 'active')}
      )
    `;
            console.log('Executing SQL:', sql);
            const result = await this.dataSource.query(sql);
            const car_id = result.insertId ?? result[0]?.insertId;
            return {
                status: 'success',
                message: 'Car created successfully',
                car_id,
            };
        }
        catch (error) {
            console.error('Error creating car:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create car',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveImage(base64Str) {
        if (!base64Str)
            return null;
        try {
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'car');
            await (0, promises_1.mkdir)(uploadPath, { recursive: true });
            const { mimeType, data } = this.parseBase64Image(base64Str);
            const ext = this.getFileExtension(mimeType);
            const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
            const filePath = path.join(uploadPath, uniqueName);
            await (0, promises_1.writeFile)(filePath, Buffer.from(data, 'base64'));
            return uniqueName;
        }
        catch (error) {
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    parseBase64Image(base64Str) {
        const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string format');
        }
        return {
            mimeType: matches[1],
            data: matches[2],
        };
    }
    getFileExtension(mimeType) {
        const map = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        return map[mimeType] || 'png';
    }
    async updateCar(carDto) {
        try {
            const { car_id, brand, model, picture1, picture2, picture3, picture_id, license_plate, car_province_id, car_type_id, driver_id, insurance_no, insurance_date, car_status } = carDto;
            if (!car_id) {
                throw new Error('Missing car_id for update');
            }
            const picture1Filename = picture1 ? await this.saveImage(picture1) : null;
            const picture2Filename = picture2 ? await this.saveImage(picture2) : null;
            const picture3Filename = picture3 ? await this.saveImage(picture3) : null;
            const pictureIdFilename = picture_id ? await this.saveImage(picture_id) : null;
            const escape = (val) => val.replace(/'/g, "''");
            const updates = [];
            if (brand)
                updates.push(`brand = '${escape(brand)}'`);
            if (model)
                updates.push(`model = '${escape(model)}'`);
            if (picture1Filename)
                updates.push(`picture1 = '${escape(picture1Filename)}'`);
            if (picture2Filename)
                updates.push(`picture2 = '${escape(picture2Filename)}'`);
            if (picture3Filename)
                updates.push(`picture3 = '${escape(picture3Filename)}'`);
            if (pictureIdFilename)
                updates.push(`picture_id = '${escape(pictureIdFilename)}'`);
            if (license_plate)
                updates.push(`license_plate = '${escape(license_plate)}'`);
            if (car_province_id !== undefined)
                updates.push(`car_province_id = ${car_province_id}`);
            if (car_type_id !== undefined)
                updates.push(`car_type_id = ${car_type_id}`);
            if (driver_id !== undefined)
                updates.push(`driver_id = ${driver_id}`);
            if (insurance_no)
                updates.push(`insurance_no = '${escape(insurance_no)}'`);
            if (insurance_date)
                updates.push(`insurance_date = '${escape(insurance_date)}'`);
            if (car_status)
                updates.push(`car_status = '${escape(car_status)}'`);
            if (updates.length === 0) {
                throw new Error('No fields to update');
            }
            const sql = `
      UPDATE kd_car SET ${updates.join(', ')} WHERE car_id = ${car_id}
    `;
            console.log('Executing SQL:', sql);
            await this.dataSource.query(sql);
            return {
                status: 'success',
                message: 'Car updated successfully',
            };
        }
        catch (error) {
            console.error('Error updating car:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update car',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CarService = CarService;
exports.CarService = CarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CarService);
//# sourceMappingURL=car.service.js.map