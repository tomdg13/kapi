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
exports.AdvertisingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const path = require("path");
let AdvertisingService = class AdvertisingService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async updateAdvertisingStatus(id, statusDto) {
        try {
            const { advertising_status } = statusDto;
            const sql = `UPDATE kd_advertising SET advertising_status = ? WHERE advertising_id = ?`;
            const values = [advertising_status, id];
            const result = await this.dataSource.query(sql, values);
            if (result.affectedRows === 0) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'Advertising not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: 'success',
                message: 'Advertising status updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update advertising status',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllAdvertisings() {
        try {
            const query = `
        SELECT *
        FROM kd_advertising
        ORDER BY advertising_date DESC
      `;
            const result = await this.dataSource.query(query);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/advertising/`;
            const updatedData = result.map(item => ({
                ...item,
                advertising_photo: item.advertising_photo
                    ? `${imageBaseUrl}${item.advertising_photo}`
                    : null,
            }));
            return {
                status: 'success',
                message: 'All advertisings retrieved successfully',
                data: updatedData,
            };
        }
        catch (error) {
            console.error('Error fetching advertisings:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to fetch advertisings',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addAdvertisingWithPhoto(advertisingDto) {
        try {
            console.log('📥 Received advertising data:', advertisingDto);
            const { advertising_note, advertising_photo, advertising_index, advertising_status, advertising_link, } = advertisingDto;
            const photoFilename = await this.saveAdvertisingImage(advertising_photo);
            const sql = `
        INSERT INTO kd_advertising (
          advertising_note, advertising_photo, advertising_date, 
          advertising_index, advertising_status, advertising_link
        ) VALUES (?, ?, NOW(), ?, ?, ?)
      `;
            const values = [
                advertising_note,
                photoFilename,
                advertising_index,
                advertising_status,
                advertising_link
            ];
            console.log('📦 Executing SQL:', sql);
            console.log('🧾 Values:', values);
            await this.dataSource.query(sql, values);
            console.log('✅ Advertising created with photo:', photoFilename);
            return {
                status: 'success',
                message: 'Advertising created successfully',
            };
        }
        catch (error) {
            console.error('❌ Error creating advertising:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create advertising',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateAdvertising(id, advertisingDto) {
        try {
            console.log('📥 Received update data for ID:', id, advertisingDto);
            const { advertising_note, advertising_photo, advertising_index, advertising_status, advertising_link, } = advertisingDto;
            let photoFilename = null;
            if (advertising_photo) {
                photoFilename = await this.saveAdvertisingImage(advertising_photo);
            }
            const setParts = [
                'advertising_note = ?',
                'advertising_index = ?',
                'advertising_status = ?',
                'advertising_link = ?'
            ];
            const values = [
                advertising_note,
                advertising_index,
                advertising_status,
                advertising_link
            ];
            if (photoFilename) {
                setParts.push('advertising_photo = ?');
                values.push(photoFilename);
            }
            values.push(id);
            const sql = `
        UPDATE kd_advertising 
        SET ${setParts.join(', ')}
        WHERE advertising_id = ?
      `;
            console.log('📦 Executing SQL:', sql);
            console.log('🧾 Values:', values);
            const result = await this.dataSource.query(sql, values);
            if (result.affectedRows === 0) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'Advertising not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            console.log('✅ Advertising updated:', id);
            return {
                status: 'success',
                message: 'Advertising updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('❌ Error updating advertising:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update advertising',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteAdvertising(id) {
        try {
            const existingAd = await this.dataSource.query('SELECT advertising_photo FROM kd_advertising WHERE advertising_id = ?', [id]);
            if (existingAd.length === 0) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'Advertising not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            await this.dataSource.query('DELETE FROM kd_advertising WHERE advertising_id = ?', [id]);
            if (existingAd[0].advertising_photo) {
                await this.deleteAdvertisingImage(existingAd[0].advertising_photo);
            }
            return {
                status: 'success',
                message: `Advertising with ID ${id} deleted successfully`,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('❌ Error deleting advertising:', error.message);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete advertising',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveAdvertisingImage(base64Str) {
        if (!base64Str)
            return null;
        try {
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'advertising');
            await fs_1.promises.mkdir(uploadPath, { recursive: true });
            const { mimeType, data } = this.parseBase64Image(base64Str);
            const ext = this.getFileExtension(mimeType);
            const uniqueName = `${Date.now()}-${(0, crypto_1.randomUUID)()}.${ext}`;
            const filePath = path.join(uploadPath, uniqueName);
            await fs_1.promises.writeFile(filePath, data, 'base64');
            console.log('📸 Image saved:', uniqueName);
            return uniqueName;
        }
        catch (error) {
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    async deleteAdvertisingImage(filename) {
        try {
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'advertising');
            const filePath = path.join(uploadPath, filename);
            await fs_1.promises.unlink(filePath);
            console.log('🗑️ Image deleted:', filename);
        }
        catch (error) {
            console.warn('⚠️ Could not delete image file:', filename, error.message);
        }
    }
    parseBase64Image(base64Str) {
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 image format');
        }
        return {
            mimeType: matches[1],
            data: matches[2],
        };
    }
    getFileExtension(mimeType) {
        const extensions = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        const ext = extensions[mimeType.toLowerCase()];
        if (!ext) {
            throw new Error(`Unsupported image type: ${mimeType}`);
        }
        return ext;
    }
};
exports.AdvertisingService = AdvertisingService;
exports.AdvertisingService = AdvertisingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AdvertisingService);
//# sourceMappingURL=advertising.service.js.map