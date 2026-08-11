import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class BookService {
  constructor(private dataSource: DataSource) { }

  async findBooksByUserId(userId?: number): Promise<any> {
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
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        status: 'error',
        message: 'Failed to fetch bookings',
        error: error.message,
      };
    }
  }

  
 async findBooksBydriverId(driverId: number): Promise<any> {
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
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        status: 'error',
        message: 'Failed to fetch bookings',
        error: error.message,
      };
    }
  }
  
  async findBooksByPassengerId(passengerId: number): Promise<any> {
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
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        status: 'error',
        message: 'Failed to fetch bookings',
        error: error.message,
      };
    }
  }

  async findBookingById(bookId: number): Promise<any> {
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
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        status: 'error',
        message: 'Failed to fetch booking',
        error: error.message,
      };
    }
  }


  async addBook(dto: any): Promise<any> {
    try {
      const {
        passenger_id,
        driver_id,
        car_id,
        pickup_lat,
        pickup_lon,
        dropoff_lat,
        dropoff_lon,
        pickup,
        dropoff,
        start_time,
        end_time,
        suggeste_price,
        payment_price,
        book_status,
        review,
      } = dto;

      const escape = (val: any) =>
        val === null || val === undefined
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
      // `result` should contain `insertId` for MySQL

      const newBookingId = result.insertId ?? (Array.isArray(result) && result[0]?.insertId) ?? null;

      return {
        status: 'success',
        message: 'Booking created successfully',
        data: { book_id: newBookingId },
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create booking',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBook(dto: any): Promise<any> {
    try {
      const { book_id, ...rest } = dto;

      if (!book_id) {
        throw new Error('Missing book_id for update');
      }

      // Filter out undefined values
      const fieldsToUpdate = Object.fromEntries(
        Object.entries(rest).filter(([_, value]) => value !== undefined),
      );

      if (Object.keys(fieldsToUpdate).length === 0) {
        throw new Error('No fields to update');
      }

      // Debug logs
      console.log(`[${new Date().toISOString()}] Updating booking with ID ${book_id}`);
      console.log('Update payload:', fieldsToUpdate);

      // Execute update using parameterized query
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
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update booking',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markMessageAsRead(bookId: number): Promise<any> {
  if (!bookId) {
    throw new HttpException(
      { status: 'error', message: 'book_id is required' },
      HttpStatus.BAD_REQUEST,
    );
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
  } catch (error) {
    console.error('Error updating message status:', error);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to update message status',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async addBookMap(dto: any): Promise<any> {
  try {
    const {
      book_id,
      driver_id,
      // book_date is no longer needed from dto
    } = dto;

    const escape = (val: any) =>
      val === null || val === undefined
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
  } catch (error) {
    console.error('Error creating bookmap record:', error);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to create bookmap record',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}




}
