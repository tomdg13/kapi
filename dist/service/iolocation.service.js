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
exports.IoLocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
let IoLocationService = class IoLocationService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findLocationById(dto) {
        try {
            const query = `SELECT * FROM io_location WHERE location_id = ?`;
            const result = await this.dataSource.query(query, [dto.id]);
            if (result.length === 0) {
                return {
                    status: 'not_found',
                    message: `Location with ID ${dto.id} not found`,
                    data: [],
                };
            }
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const locationWithImageUrl = result.map((location) => ({
                ...location,
                image_url: location.image ? imageBaseUrl + location.image : null,
            }));
            return {
                status: 'success',
                message: 'Location fetched successfully',
                data: locationWithImageUrl,
            };
        }
        catch (error) {
            console.error('Error fetching location:', error);
            return {
                status: 'error',
                message: 'Failed to fetch location info',
                error: error.message,
            };
        }
    }
    async findLocationsByStatus(dto) {
        try {
            let query;
            let params = [];
            if (dto.status?.toLowerCase() === 'admin') {
                if (dto.company_id) {
                    query = `SELECT * FROM io_location WHERE company_id = ?`;
                    params.push(dto.company_id);
                }
                else {
                    query = `SELECT * FROM io_location`;
                }
            }
            else {
                if (dto.company_id && dto.status) {
                    query = `SELECT * FROM io_location WHERE status = ? AND company_id = ?`;
                    params.push(dto.status, dto.company_id);
                }
                else if (dto.status) {
                    query = `SELECT * FROM io_location WHERE status = ?`;
                    params.push(dto.status);
                }
                else {
                    query = `SELECT * FROM io_location`;
                }
            }
            const result = await this.dataSource.query(query, params);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/iouser/`;
            const locationsWithImageUrls = result.map((location) => ({
                ...location,
                image_url: location.image ? imageBaseUrl + location.image : null,
            }));
            return {
                status: 'success',
                message: dto.status?.toLowerCase() === 'admin'
                    ? `All locations fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
                    : `Locations with status ${dto.status}${dto.company_id ? ` for company ${dto.company_id}` : ''} fetched`,
                data: locationsWithImageUrls,
            };
        }
        catch (error) {
            console.error('Error fetching locations by status:', error);
            return {
                status: 'error',
                message: 'Failed to fetch locations',
                error: error.message,
            };
        }
    }
    async addLocationWithImage(locationDto) {
        try {
            const { company_id, location, image } = locationDto;
            console.log(`Adding location with location: ${location}, company_id: ${company_id}`);
            if (location && company_id) {
                const existingLocationQuery = `
          SELECT location, company_id 
          FROM io_location 
          WHERE location = ? AND company_id = ?
        `;
                const existingLocations = await this.dataSource.query(existingLocationQuery, [location, company_id]);
                if (existingLocations && existingLocations.length > 0) {
                    const existingLocation = existingLocations[0];
                    console.log(`Found existing location:`, existingLocation);
                    console.log(`❌ REJECTING: Location ${location} already exists in company ${company_id}`);
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Location ${location} already exists in this company`,
                        details: `Existing location "${existingLocation.location}"`,
                    }, common_1.HttpStatus.CONFLICT);
                }
                else {
                    console.log(`✅ ALLOWING: No existing location with location ${location} in company ${company_id}`);
                }
            }
            const imageFileName = await this.saveImage(image);
            const sql = `
        INSERT INTO io_location (
          company_id, location, image
        ) VALUES (?, ?, ?)
      `;
            const values = [
                company_id,
                location,
                imageFileName,
            ];
            console.log('Executing SQL with values:', values);
            await this.dataSource.query(sql, values);
            console.log(`✅ Location created successfully: ${location} in company ${company_id}`);
            return {
                status: 'success',
                message: 'Location created successfully',
            };
        }
        catch (error) {
            console.error('Error creating location:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create location',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveImage(base64Str) {
        if (!base64Str)
            return null;
        try {
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'iouser');
            await fs.mkdir(uploadPath, { recursive: true });
            const { mimeType, data } = this.parseBase64Image(base64Str);
            const ext = this.getFileExtension(mimeType);
            const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
            const filePath = path.join(uploadPath, uniqueFileName);
            await fs.writeFile(filePath, data, 'base64');
            return uniqueFileName;
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
    async updateLocationWithImage(locationId, locationDto) {
        try {
            console.log('📝 Received locationDto:', JSON.stringify(locationDto, null, 2));
            const { company_id, location, image } = locationDto;
            const [existingLocation] = await this.dataSource.query(`SELECT image FROM io_location WHERE location_id = ?`, [locationId]);
            if (!existingLocation) {
                throw new common_1.NotFoundException('Location not found');
            }
            const imageFileName = image ? await this.saveImage(image) : existingLocation.image;
            const updates = [];
            const values = [];
            const addField = (fieldName, value) => {
                if (value !== null && value !== undefined) {
                    updates.push(`${fieldName} = ?`);
                    values.push(value);
                }
            };
            addField('company_id', company_id);
            addField('location', location);
            addField('image', imageFileName);
            if (updates.length === 0) {
                throw new Error('No valid fields to update');
            }
            values.push(locationId);
            const sql = `
        UPDATE io_location SET
          ${updates.join(', ')}
        WHERE location_id = ?
      `;
            console.log('🧾 Executing SQL:\n', sql);
            console.log('📦 With values:', values);
            const result = await this.dataSource.query(sql, values);
            if (result.affectedRows === 0) {
                throw new common_1.NotFoundException('Location not found or no changes made');
            }
            console.log('✅ Location update complete for location_id:', locationId);
            return {
                status: 'success',
                message: 'Location updated successfully',
            };
        }
        catch (error) {
            console.error('❌ Error updating location:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update location',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteLocation(locationId) {
        try {
            const [existingLocation] = await this.dataSource.query(`SELECT location_id, location FROM io_location WHERE location_id = ?`, [locationId]);
            if (!existingLocation) {
                throw new common_1.NotFoundException('Location not found');
            }
            const sql = `DELETE FROM io_location WHERE location_id = ?`;
            const result = await this.dataSource.query(sql, [locationId]);
            if (result.affectedRows === 0) {
                throw new Error('Failed to delete location');
            }
            console.log(`✅ Location deleted successfully: ${existingLocation.location} (ID: ${locationId})`);
            return {
                status: 'success',
                message: 'Location deleted successfully',
            };
        }
        catch (error) {
            console.error('❌ Error deleting location:', error.message);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete location',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoLocationService = IoLocationService;
exports.IoLocationService = IoLocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IoLocationService);
//# sourceMappingURL=iolocation.service.js.map