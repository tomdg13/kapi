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
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let BookService = class BookService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findBooksByUserId(userId) {
        try {
            let query = 'SELECT * FROM kdv_book';
            const params = [];
            if (userId) {
                query += ' WHERE passenger_id = ? OR driver_id = ?';
                params.push(userId, userId);
            }
            const result = await this.dataSource.query(query, params);
            return {
                status: 'success',
                message: userId ? `Bookings for user ${userId}` : 'All bookings fetched',
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            return {
                status: 'error',
                message: 'Failed to fetch bookings',
                error: error.message,
            };
        }
    }
    async findBooksBydriverId(driverId) {
        try {
            if (!driverId) {
                throw new Error('driver_id is required');
            }
            const query = 'SELECT * FROM kdv_book WHERE driver_id = ?';
            const result = await this.dataSource.query(query, [driverId]);
            return {
                status: 'success',
                message: `Bookings for driver ${driverId}`,
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            return {
                status: 'error',
                message: 'Failed to fetch bookings',
                error: error.message,
            };
        }
    }
    async findBooksByPassengerId(passengerId) {
        try {
            if (!passengerId) {
                throw new Error('passenger_id is required');
            }
            const query = 'SELECT * FROM kdv_book WHERE passenger_id = ?';
            const result = await this.dataSource.query(query, [passengerId]);
            return {
                status: 'success',
                message: `Bookings for passenger ${passengerId}`,
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            return {
                status: 'error',
                message: 'Failed to fetch bookings',
                error: error.message,
            };
        }
    }
    async findBookingById(bookId) {
        try {
            const query = 'SELECT * FROM kdv_book WHERE book_id = ? LIMIT 1';
            const result = await this.dataSource.query(query, [bookId]);
            if (result.length === 0) {
                return {
                    status: 'error',
                    message: `Booking with id ${bookId} not found`,
                };
            }
            return {
                status: 'success',
                message: `Booking ${bookId} fetched successfully`,
                data: result[0],
            };
        }
        catch (error) {
            console.error('Error fetching booking:', error);
            return {
                status: 'error',
                message: 'Failed to fetch booking',
                error: error.message,
            };
        }
    }
    async addBook(dto) {
        try {
            const { passenger_id, driver_id, car_id, pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, pickup, dropoff, start_time, end_time, suggeste_price, payment_price, book_status, review, } = dto;
            const escape = (val) => val === null || val === undefined
                ? 'NULL'
                : typeof val === 'string'
                    ? `'${val.replace(/'/g, "''")}'`
                    : val;
            const sql = `
      INSERT INTO kd_book (
        passenger_id, driver_id, car_id,
        pickup_lat, pickup_lon, dropoff_lat, dropoff_lon,
        pickup, dropoff, start_time, end_time,
        suggeste_price, payment_price, book_status, review
      ) VALUES (
        ${escape(passenger_id)}, ${escape(driver_id)}, ${escape(car_id)},
        ${escape(pickup_lat)}, ${escape(pickup_lon)}, ${escape(dropoff_lat)}, ${escape(dropoff_lon)},
        ${escape(pickup)}, ${escape(dropoff)}, ${escape(start_time)}, ${escape(end_time)},
        ${escape(suggeste_price)}, ${escape(payment_price)}, ${escape(book_status)}, ${escape(review)}
      )
    `;
            const result = await this.dataSource.query(sql);
            const newBookingId = result.insertId ?? (Array.isArray(result) && result[0]?.insertId) ?? null;
            return {
                status: 'success',
                message: 'Booking created successfully',
                data: { book_id: newBookingId },
            };
        }
        catch (error) {
            console.error('Error creating booking:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create booking',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateBook(dto) {
        try {
            const { book_id, ...rest } = dto;
            if (!book_id) {
                throw new Error('Missing book_id for update');
            }
            const fieldsToUpdate = Object.fromEntries(Object.entries(rest).filter(([_, value]) => value !== undefined));
            if (Object.keys(fieldsToUpdate).length === 0) {
                throw new Error('No fields to update');
            }
            console.log(`[${new Date().toISOString()}] Updating booking with ID ${book_id}`);
            console.log('Update payload:', fieldsToUpdate);
            await this.dataSource
                .createQueryBuilder()
                .update('kd_book')
                .set(fieldsToUpdate)
                .where('book_id = :book_id', { book_id })
                .execute();
            return {
                status: 'success',
                message: 'Booking updated successfully',
            };
        }
        catch (error) {
            console.error('Error updating booking:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update booking',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async markMessageAsRead(bookId) {
        if (!bookId) {
            throw new common_1.HttpException({ status: 'error', message: 'book_id is required' }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.dataSource
                .createQueryBuilder()
                .update('kd_book')
                .set({ messageread: 'Read' })
                .where('book_id = :bookId', { bookId })
                .execute();
            if (result.affected === 0) {
                return {
                    status: 'error',
                    message: `Booking with id ${bookId} not found`,
                };
            }
            return {
                status: 'success',
                message: `Message status updated to Read for booking ${bookId}`,
            };
        }
        catch (error) {
            console.error('Error updating message status:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update message status',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addBookMap(dto) {
        try {
            const { book_id, driver_id, } = dto;
            const escape = (val) => val === null || val === undefined
                ? 'NULL'
                : typeof val === 'string'
                    ? `'${val.replace(/'/g, "''")}'`
                    : val;
            const sql = `
      INSERT INTO kd_bookmap (
        book_id, driver_id, book_date
      ) VALUES (
        ${escape(book_id)}, ${escape(driver_id)}, NOW()
      )
    `;
            const result = await this.dataSource.query(sql);
            const newBookmapId = result.insertId ?? (Array.isArray(result) && result[0]?.insertId) ?? null;
            return {
                status: 'success',
                message: 'Bookmap record created successfully',
                data: { bookmap_id: newBookmapId },
            };
        }
        catch (error) {
            console.error('Error creating bookmap record:', error);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create bookmap record',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BookService);
//# sourceMappingURL=book.service.js.map