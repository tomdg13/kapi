
import { CheckPromoteDto, CreateOtpDto, CustomerDto, CustomerpDto } from 'src/dto/customer.dto';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import * as bcrypt from 'bcryptjs';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

import { SmsService, TelbizSmsRequest } from './sms.service';
import { CheckBannerDto, CreateBannerDto } from 'src/dto/create-promotion.dto';

@Injectable()
export class customerService {
  constructor(private dataSource: DataSource, private readonly smsService: SmsService) { }

  async findCustomerById(dto: CustomerDto): Promise<any> {
    try {
      const query = `SELECT * FROM kd_customer WHERE customer_id = ?`;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        return {
          status: 'not_found',
          message: `Customer with ID ${dto.id} not found`,
          data: [],
        };
      }

      return {
        status: 'success',
        message: 'Customer fetched successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return {
        status: 'error',
        message: 'Failed to fetch customer info',
        error: error.message,
      };
    }
  }

  async checkCustomerByPhone(dto: CustomerpDto): Promise<any> {
    try {
      console.log('Checking phone:', dto.phone);

      const query = `SELECT * FROM kd_customer WHERE phone = ?`;
      const result = await this.dataSource.query(query, [dto.phone]);

      if (result.length > 0) {
        return {
          result: 'YES',
          message: 'Customer with this phone exists',
        };
      } else {
        return {
          result: 'NO',
          message: 'No customer found with this phone',
        };
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      return {
        result: 'ERROR',
        message: 'Failed to check customer by phone',
        error: error.message,
      };
    }
  }

  async OtpCustomerByPhone(dto: CustomerpDto): Promise<any> {
    try {
      console.log('Checking phone:', dto.phone);

      const query = `SELECT OTP FROM kd_otp WHERE phone = ? LIMIT 1`;
      const result = await this.dataSource.query(query, [dto.phone]);

      if (result.length > 0) {
        // Return the OTP value along with the message
        return {
          result: 'YES',
          message: 'Customer with this phone exists',
          otp: result[0].OTP,  // Assuming column name is OTP (case sensitive)
        };
      } else {
        return {
          result: 'NO',
          message: 'No customer found with this phone',
          otp: null,
        };
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      return {
        result: 'ERROR',
        message: 'Failed to check customer by phone',
        error: error.message,
      };
    }
  }

  async OtpDriverByPhone(dto: CustomerpDto): Promise<any> {
    try {
      console.log('Checking phone:', dto.phone);

      const query = `SELECT OTP FROM kd_otp WHERE phone = ? LIMIT 1`;
      const result = await this.dataSource.query(query, [dto.phone]);

      if (result.length > 0) {
        return {
          result: 'YES',
          message: 'Driver with this phone exists',
          otp: result[0].OTP,  // Return the OTP value here
        };
      } else {
        return {
          result: 'NO',
          message: 'No driver found with this phone',
          otp: null,
        };
      }
    } catch (error) {
      console.error('Error fetching driver:', error);
      return {
        result: 'ERROR',
        message: 'Failed to check driver by phone',
        error: error.message,
      };
    }
  }


  async checkDriverByPhone(dto: { phone: string }): Promise<any> {
    try {
      console.log('Checking driver phone:', dto.phone);

      const query = `SELECT * FROM kd_driver WHERE phone = ?`;
      const result = await this.dataSource.query(query, [dto.phone]);

      if (result.length > 0) {
        return {
          result: 'YES',
          message: 'Driver with this phone exists',
        };
      } else {
        return {
          result: 'NO',
          message: 'No driver found with this phone',
        };
      }
    } catch (error) {
      console.error('Error checking driver by phone:', error);
      return {
        result: 'ERROR',
        message: 'Failed to check driver by phone',
        error: error.message,
      };
    }
  }


  async findCustomersByRole(dto: CustomerDto): Promise<any> {
    try {
      let query: string;
      let params: any[] = [];

      if (dto.role.toLowerCase() === 'admin') {
        // Admin: show all customers
        query = `SELECT * FROM kd_customer`;
      } else {
        // Non-admin: filter by role
        query = `SELECT * FROM kd_customer WHERE role = ?`;
        params.push(dto.role);
      }

      const result = await this.dataSource.query(query, params);

      // Base URL where photos are hosted


      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/customer/`;

      // Append full photo URLs
      const customersWithPhotos = result.map((customer: any) => ({
        ...customer,
        photo: customer.photo ? imageBaseUrl + customer.photo : null,
        photo_id: customer.photo_id ? imageBaseUrl + customer.photo_id : null,
      }));

      return {
        status: 'success',
        message: dto.role.toLowerCase() === 'admin' ? 'All customers fetched' : `Customers with role ${dto.role} fetched`,
        data: customersWithPhotos,
      };
    } catch (error) {
      console.error('Error fetching customers by role:', error);
      return {
        status: 'error',
        message: 'Failed to fetch customers',
        error: error.message,
      };
    }
  }

  async findAllcartype(): Promise<any> {
    try {
      const query = `SELECT * FROM kd_cartype order by index_price `;
      const result = await this.dataSource.query(query);

      return {
        status: 'success',
        message: 'kd_cartype fetched successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error fetching kd_cartype:', error);
      return {
        status: 'error',
        message: 'Failed to fetch kd_cartype',
        error: error.message,
      };
    }
  }


  async findAllBanks(): Promise<any> {
    try {
      const query = `SELECT * FROM kd_bank order by bank_name`;
      const result = await this.dataSource.query(query);

      return {
        status: 'success',
        message: 'Banks fetched successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error fetching banks:', error);
      return {
        status: 'error',
        message: 'Failed to fetch banks',
        error: error.message,
      };
    }
  }

  async findAllProvinces(): Promise<any> {
    try {
      const result = await this.dataSource.query('SELECT * FROM kd_province order by pr_name');
      return {
        status: 'success',
        message: 'Provinces fetched successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return {
        status: 'error',
        message: 'Failed to fetch provinces',
        error: error.message,
      };
    }
  }

  async findDistrictsByProvinceId(pr_id: number): Promise<any> {
    try {
      const result = await this.dataSource.query(
        'SELECT * FROM kd_district WHERE pr_id = ? order by dr_name',
        [pr_id],
      );

      return {
        status: 'success',
        message: 'Districts fetched successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error fetching districts:', error);
      return {
        status: 'error',
        message: 'Failed to fetch districts',
        error: error.message,
      };
    }
  }

  async findVillagesByDistrict(dto: VillageIdDto): Promise<any> {
    try {
      const query = `
      SELECT * FROM kd_village
      WHERE dr_id = ? AND dr_id IN (
        SELECT dr_id FROM kd_district WHERE pr_id = ?
      ) order by vill_name`;
      const result = await this.dataSource.query(query, [dto.dr_id, dto.pr_id]);

      return {
        status: 'success',
        message: 'Villages fetched successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error fetching villages:', error);
      return {
        status: 'error',
        message: 'Failed to fetch villages',
        error: error.message,
      };
    }
  }

  async addCustomerWithPhoto(customerDto: any): Promise<{ status: string; message: string }> {
    try {
      const {
        name,
        username,
        email,
        password,
        phone,
        document_id,
        photo,
        photo_id,
        village_id,
        district_id,
        province_id,
        status,
        role,
        account_bank_id,
        account_no,
        account_name,
        language,
        bio,
      } = customerDto;

      const photoFilename = await this.saveImage(photo);
      const photoIdFilename = await this.saveImage(photo_id);

      const escapeValue = (value: any): string => {
        if (value === null || value === undefined) return 'NULL';
        return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : String(value);
      };

      const sql = `
        INSERT INTO kd_customer (
           name, username, email, password, phone, document_id,
          photo, photo_id, village_id, district_id, province_id,
          status, role, account_bank_id, account_no, account_name, language,bio
        ) VALUES (
          
          ${escapeValue(name)},
          ${escapeValue(username)},
          ${escapeValue(email)},
          ${escapeValue(password)},
          ${escapeValue(phone)},
          ${escapeValue(document_id)},
          ${escapeValue(photoFilename)},
          ${escapeValue(photoIdFilename)},
          ${escapeValue(village_id)},
          ${escapeValue(district_id)},
          ${escapeValue(province_id)},
          ${escapeValue(status)},
          ${escapeValue(role)},
          ${escapeValue(account_bank_id)},
          ${escapeValue(account_no)},
          ${escapeValue(account_name)},
          ${escapeValue(language)},
          ${escapeValue(bio)}
        )`;

      console.log('Executing SQL:', sql);
      await this.dataSource.query(sql);

      return {
        status: 'success',
        message: 'Customer created successfully',
      };
    } catch (error) {
      console.error('Error creating customer:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create customer',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'customer');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueName);

      await fs.writeFile(filePath, data, 'base64');
      return uniqueName;
    } catch (error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  private parseBase64Image(base64Str: string): { mimeType: string; data: string } {
    const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string format');
    }
    return {
      mimeType: matches[1],
      data: matches[2],
    };
  }

  private getFileExtension(mimeType: string): string {
    const map: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    return map[mimeType] || 'png';
  }

  async updateCustomerWithPhoto(phone: string, customerDto: any): Promise<{ status: string; message: string }> {
    try {
      console.log('📝 Received customerDto:', JSON.stringify(customerDto, null, 2));

      const {
        name,
        username,
        email,
        password,
        phone: newPhone, // Avoid shadowing input param
        document_id,
        photo,
        photo_id,
        village_id,
        district_id,
        province_id,
        status,
        role,
        account_bank_id,
        account_no,
        account_name,
        language,
        bio,
      } = customerDto;

      const [existingCustomer] = await this.dataSource.query(
        `SELECT photo, photo_id FROM kd_customer WHERE phone = '${phone}'`
      );
      if (!existingCustomer) {
        throw new Error('Customer not found');
      }

      const photoFilename = photo ? await this.saveImage(photo) : existingCustomer.photo;
      const photoIdFilename = photo_id ? await this.saveImage(photo_id) : existingCustomer.photo_id;

      const escapeValue = (value: any): string => {
        if (value === null || value === undefined) return 'NULL';
        return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : String(value);
      };

      const sql = `
      UPDATE kd_customer SET
        name = ${escapeValue(name)},
        username = ${escapeValue(username)},
        email = ${escapeValue(email)},
        
        phone = ${escapeValue(newPhone)},
        document_id = ${escapeValue(document_id)},
        photo = ${escapeValue(photoFilename)},
        photo_id = ${escapeValue(photoIdFilename)},
        village_id = ${escapeValue(village_id)},
        district_id = ${escapeValue(district_id)},
        province_id = ${escapeValue(province_id)},
        status = ${escapeValue(status)},
        role = ${escapeValue(role)},
        account_bank_id = ${escapeValue(account_bank_id)},
        account_no = ${escapeValue(account_no)},
        account_name = ${escapeValue(account_name)},
        bio = ${escapeValue(account_name)},
        language = ${escapeValue(language)}
        
      WHERE phone = '${phone}'
    `;

      console.log('🧾 Executing SQL:\n', sql);
      await this.dataSource.query(sql);

      console.log('✅ Customer update complete for phone:', phone);
      return {
        status: 'success',
        message: 'Customer updated successfully',
      };
    } catch (error) {
      console.error('❌ Error updating customer:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update customer',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCustomerStatus(phone: string, onlineStatus: string): Promise<{ status: string; message: string }> {
    try {
      const result = await this.dataSource.query(
        `UPDATE kd_customer SET status = ? WHERE phone = ?`,
        [onlineStatus, phone]
      );

      if (result.affectedRows === 0) {
        throw new Error('Customer not found or no change');
      }

      return {
        status: 'success',
        message: `Customer status updated to ${onlineStatus}`,
      };
    } catch (error) {
      console.error('❌ Error updating customer status:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update customer status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateCustomeronStatus(phone: string, onlineStatus: string): Promise<{ status: string; message: string }> {
    try {
      const result = await this.dataSource.query(
        `UPDATE kd_customer SET online = ? WHERE phone = ?`,
        [onlineStatus, phone]
      );

      if (result.affectedRows === 0) {
        throw new Error('Customer not found or no change');
      }

      return {
        status: 'success',
        message: `Customer online status updated to ${onlineStatus}`,
      };
    } catch (error) {
      console.error('❌ Error updating customer online status:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update customer online status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  async updateCustomerOnlineStatus(phone: string, onlineStatus: string): Promise<{ status: string; message: string }> {
    try {
      const result = await this.dataSource.query(
        `UPDATE kd_driver SET online = '${onlineStatus}' WHERE phone = '${phone}'`
      );

      if (result.affectedRows === 0) {
        throw new Error('Driver not found or no change');
      }

      return {
        status: 'success',
        message: `Driver status updated to ${onlineStatus}`,
      };
    } catch (error) {
      console.error('❌ Error updating online status:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update Driver online status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addDriverWithPhoto(driverDto: any): Promise<{ status: string; message: string }> {
    try {
      const {
        name,
        username,
        email,
        password,
        phone,
        document_id,
        photo,
        photo_id,
        village_id,
        district_id,
        province_id,
        status,
        role,
        account_bank_id,
        account_no,
        account_name,
        language,
        bio,
        online,
      } = driverDto;

      const photoFilename = await this.saveDriverImage(photo);
      const photoIdFilename = await this.saveDriverImage(photo_id);

      const escapeValue = (value: any): string => {
        if (value === null || value === undefined) return 'NULL';
        return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : String(value);
      };

      const sql = `
      INSERT INTO kd_driver (
        name, username, email, password, phone, document_id,
        photo, photo_id, village_id, district_id, province_id,
        status, role, account_bank_id, account_no, account_name,
        language, bio, online
      ) VALUES (
        ${escapeValue(name)},
        ${escapeValue(username)},
        ${escapeValue(email)},
        ${escapeValue(password)},
        ${escapeValue(phone)},
        ${escapeValue(document_id)},
        ${escapeValue(photoFilename)},
        ${escapeValue(photoIdFilename)},
        ${escapeValue(village_id)},
        ${escapeValue(district_id)},
        ${escapeValue(province_id)},
        ${escapeValue(status)},
        ${escapeValue(role)},
        ${escapeValue(account_bank_id)},
        ${escapeValue(account_no)},
        ${escapeValue(account_name)},
        ${escapeValue(language)},
        ${escapeValue(bio)},
        ${escapeValue(online)}
      )
    `;

      console.log('Executing SQL:', sql);
      await this.dataSource.query(sql);

      return {
        status: 'success',
        message: 'Driver created successfully',
      };
    } catch (error) {
      console.error('Error creating driver:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create driver',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveDriverImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'driver');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueName);

      await fs.writeFile(filePath, data, 'base64');
      return uniqueName;
    } catch (error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }


  // ✅ Public method to request OTP with 5-per-day limit
  async requestOtp(dto: { phone: string }): Promise<any> {
    const { phone } = dto;

    // 🕒 Count OTPs requested today (with timezone fix if DB is in UTC)
    const todayCountQuery = `
    SELECT COUNT(*) as count 
    FROM kd_otp 
    WHERE phone = ? 
      AND DATE(CONVERT_TZ(date, '+00:00', '+07:00')) = CURDATE()
  `;
    const result = await this.dataSource.query(todayCountQuery, [phone]);
    const count = result[0]?.count || 0;

    console.log(`🔢 OTPs requested today for ${phone}: ${count}`);

    if (count >= 5) {
      return {
        success: false,
        message: 'You have reached the daily OTP limit. Please try again tomorrow.',
      };
    }

    // ✅ Generate and insert new OTP
    const otpResult = await this.create({ phone });

    return {
      success: true,
      otp: otpResult.otp, // ⚠️ Remove this in production
      insertedId: otpResult.insertedId,
      timestamp: otpResult.timestamp,
      expires_at: otpResult.expires_at,
      message: 'OTP sent successfully',
    };
  }


  // ✅ Existing OTP generation and insert
  async create(createOtpDto: { phone: string }): Promise<any> {
    const { phone } = createOtpDto;
    const app = 'customer';  // fixed value
    const date = new Date();

    // 1. Check how many OTPs already created today for this phone
    const todayCountQuery = `
    SELECT COUNT(*) as count 
    FROM kd_otp 
    WHERE phone = ? AND DATE(date) = CURDATE()
  `;
    const countResult = await this.dataSource.query(todayCountQuery, [phone]);
    const count = countResult[0]?.count || 0;

    if (count >= 5) {
      // If 5 or more OTPs already created today, prevent new insert
      return {
        success: false,
        message: 'You have reached the daily OTP limit (5). Please try again tomorrow.',
      };
    }

    // 2. Generate unique OTP
    let otp = this.generateOtp();
    while (await this.isOtpExist(otp)) {
      otp = this.generateOtp();
    }

    const message = `Your OTP code is ${otp}`;


    // 3. Insert new OTP
    const sql = `
    INSERT INTO kd_otp (message, phone, app, otp, date)
    VALUES (?, ?, ?, ?, ?)
  `;

    /** Send SMS gateway here */
    /** Object Request to Sms provider */
    const smsData: TelbizSmsRequest = {
      title: 'OTP',
      phone: phone,
      message: message,
    };
    // Send SMS using SmsService
    this.smsService.sendSMS(smsData, 'Sabaikee-App')

    // --------------------------------------------------------------------------------------------------------------------------OFF API OTP

    const result = await this.dataSource.query(sql, [message, phone, app, otp, date]);


    return {
      success: true,
      otp,
      insertedId: result.insertId,
    };
  }



  async verifyOtp(phone: string, otp: string): Promise<any> {
    const sql = `
    SELECT * FROM kd_otp 
    WHERE phone = ? AND otp = ? 
    ORDER BY date DESC LIMIT 1
  `;
    const result = await this.dataSource.query(sql, [phone, otp]);

    if (!result.length) {
      return { success: false, message: 'Invalid OTP' };
    }

    const record = result[0];
    const now = new Date();

    if (new Date(record.expires_at) < now) {
      return { success: false, message: 'OTP has expired' };
    }

    return { success: true, message: 'OTP is valid' };
  }



  // ✅ Generate random 6-digit OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ✅ Check if OTP already exists in the table
  private async isOtpExist(otp: string): Promise<boolean> {
    const sql = `SELECT COUNT(*) as count FROM kd_otp WHERE otp = ?`;
    const result = await this.dataSource.query(sql, [otp]);
    return result[0].count > 0;
  }


  async updateCustomerPassword(phone: string, newPassword: string): Promise<{ status: string; message: string }> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const result = await this.dataSource.query(
        `UPDATE kd_customer SET password = ? WHERE phone = ?`,
        [hashedPassword, phone]
      );
      if (result.affectedRows === 0) {
        throw new Error('Customer not found or no change');
      }
      return {
        status: 'success',
        message: 'Password updated successfully',
      };
    } catch (error) {
      console.error('❌ Error updating password:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update password',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async generateResetPassword(phone: string): Promise<{ status: string; message: string; tempPassword?: string }> {
    try {
      const tempPassword = Math.random().toString(36).slice(-4) +
                            Math.random().toString(36).slice(-4);
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      const result = await this.dataSource.query(
        `UPDATE kd_customer SET password = ? WHERE phone = ?`,
        [hashedPassword, phone]
      );

      if (result.affectedRows === 0) {
        throw new Error('Customer not found');
      }

      return {
        status: 'success',
        message: 'Temporary password generated',
        tempPassword,
      };
    } catch (error) {
      console.error('❌ Error generating reset password:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to generate reset password',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateDriverPassword(phone: string, newPassword: string): Promise<{ status: string; message: string }> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const result = await this.dataSource.query(
        `UPDATE kd_driver SET password = ? WHERE phone = ?`,
        [hashedPassword, phone]
      );

      // Check if any row was affected (updated)
      if (result.affectedRows === 0) {
        throw new Error('Customer not found or no change');
      }

      return {
        status: 'success',
        message: 'Password updated successfully',
      };
    } catch (error) {
      console.error('❌ Error updating password:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update password',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



async updateioPassword(phone: string, newPassword: string): Promise<{ status: string; message: string }> {
  try {
    
    
    // Use parameterized query to prevent SQL injection
    const result = await this.dataSource.query(
      `UPDATE io_user SET password = '${newPassword}',status = 'active' WHERE phone = '${phone}'`
    );

    // Check if any row was affected (updated)
    if (result.affectedRows === 0) {
      throw new Error('Customer not found or no change');
    }

    return {
      status: 'success',
      message: 'Password updated successfully',
    };
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to update password',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

  async checkPromoteByPhone(dto: CheckPromoteDto): Promise<any> {
    try {
      const query = `
      SELECT promote_id, promote_note, promote_photo, promote_date,
             promote_phone, location
      FROM kd_promote
      WHERE promote_phone = ?
    `;
      const result = await this.dataSource.query(query, [dto.phone]);

      if (!result.length) {
        return {
          status: 'not_found',
          message: `Promote entry with phone ${dto.phone} not found`,
          data: [],
        };
      }

      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/promote/`;
      const updatedData = result.map(item => ({
        ...item,
        promote_photo: item.promote_photo
          ? imageBaseUrl + item.promote_photo
          : null,
      }));

      return {
        status: 'success',
        message: 'Promote entry found',
        data: updatedData,
      };
    } catch (error) {
      console.error('Error checking promote entry:', error);
      return {
        status: 'error',
        message: 'Failed to check promote by phone',
        error: error.message,
      };
    }
  }

  async getNearbyPromotes(dto: { latitude: number; longitude: number }): Promise<any> {
    try {
      const { latitude, longitude } = dto;

      // Get the limit value from parameters
      const limitQuery = `SELECT setup FROM kd_parameter WHERE parameter = 'promote limit'`;
      const limitResult = await this.dataSource.query(limitQuery);
      const limit = limitResult[0]?.setup || 10; // Default to 10 if not found

      const query = `
      SELECT 
        promote_id,
        promote_note,
        promote_photo,
        promote_date,
        promote_phone,
        location,
        latitude,
        longitude,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )
        ) AS distance
      FROM kdv_promote
      CROSS JOIN (SELECT setup as max_distance FROM kd_parameter WHERE parameter = 'promote range km') p
      WHERE 
        p.max_distance = 0
        OR
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )
        ) <= p.max_distance
      ORDER BY RAND()
      LIMIT ?
    `;

      // Pass 7 parameters: lat, lng, lat, lat, lng, lat, limit
      const result = await this.dataSource.query(query, [
        latitude,
        longitude,
        latitude,
        latitude,
        longitude,
        latitude,
        limit
      ]);

      if (!result.length) {
        return {
          status: 'not_found',
          message: 'No promotes found within the specified distance of your location.',
          data: [],
        };
      }

      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/promote/`;
      const updatedData = result.map(item => ({
        ...item,
        promote_photo: item.promote_photo ? imageBaseUrl + item.promote_photo : null,
      }));

      return {
        status: 'success',
        message: 'Nearby promote entries found',
        data: updatedData,
      };
    } catch (error) {
      console.error('Error fetching nearby promotes:', error);
      return {
        status: 'error',
        message: 'Failed to fetch nearby promotes',
        error: error.message,
      };
    }
  }

  // async getNearbyPromotes(dto: { latitude: number; longitude: number }): Promise<any> {
  //   try {
  //     const { latitude, longitude } = dto;

  //     const query = `
  //       SELECT 
  //         promote_id,
  //         promote_note,
  //         promote_photo,
  //         promote_date,
  //         promote_phone,
  //         location,
  //         latitude,
  //         longitude,
  //         (
  //           6371 * acos(
  //             cos(radians(?)) * cos(radians(latitude)) *
  //             cos(radians(longitude) - radians(?)) +
  //             sin(radians(?)) * sin(radians(latitude))
  //           )
  //         ) AS distance
  //       FROM kdv_promote
  //       CROSS JOIN (SELECT setup as max_distance FROM kd_parameter WHERE parameter = 'promote') p
  //       WHERE 
  //         p.max_distance = 0
  //         OR
  //         (
  //           6371 * acos(
  //             cos(radians(?)) * cos(radians(latitude)) *
  //             cos(radians(longitude) - radians(?)) +
  //             sin(radians(?)) * sin(radians(latitude))
  //           )
  //         ) <= p.max_distance
  //       ORDER BY RAND()
  //       LIMIT 10
  //     `;

  //     // Pass 6 parameters: lat, lng, lat, lat, lng, lat
  //     const result = await this.dataSource.query(query, [
  //       latitude, 
  //       longitude, 
  //       latitude, 
  //       latitude, 
  //       longitude, 
  //       latitude
  //     ]);

  //     if (!result.length) {
  //       return {
  //         status: 'not_found',
  //         message: 'No promotes found within the specified distance of your location.',
  //         data: [],
  //       };
  //     }

  //     const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/promote/`;
  //     const updatedData = result.map(item => ({
  //       ...item,
  //       promote_photo: item.promote_photo ? imageBaseUrl + item.promote_photo : null,
  //     }));

  //     return {
  //       status: 'success',
  //       message: 'Nearby promote entries found',
  //       data: updatedData,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching nearby promotes:', error);
  //     return {
  //       status: 'error',
  //       message: 'Failed to fetch nearby promotes',
  //       error: error.message,
  //     };
  //   }
  // }

  async addPromotionWithPhoto(promoteDto: any): Promise<{ status: string; message: string }> {
    try {
      const {
        promote_note,
        promote_photo,
        promote_phone,
        location,
      } = promoteDto;

      const photoFilename = await this.savePromoteImage(promote_photo);

      const sql = `
        INSERT INTO kd_promote (
          promote_note, promote_photo, promote_date, promote_phone, location
        ) VALUES (?, ?, NOW(), ?, ?)
      `;

      console.log('Executing SQL:', sql, [promote_note, photoFilename, promote_phone, location]);
      await this.dataSource.query(sql, [promote_note, photoFilename, promote_phone, location]);

      return {
        status: 'success',
        message: 'Promotion created successfully',
      };
    } catch (error) {
      console.error('Error creating promotion:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create promotion',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async savePromoteImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'promote');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueName);

      await fs.writeFile(filePath, data, 'base64');
      return uniqueName;
    } catch (error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  async getAllBanners(): Promise<any> {
    try {
      const query = `
      SELECT *
      FROM kd_banner
      ORDER BY banner_date DESC
    `;
      const result = await this.dataSource.query(query);


      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/banner/`;

      const updatedData = result.map(item => ({
        ...item,
        banner_photo: item.banner_photo ? imageBaseUrl + item.banner_photo : null,
      }));

      return {
        status: 'success',
        message: 'All banners retrieved',
        data: updatedData,
      };
    } catch (error) {
      console.error('Error fetching banners:', error);
      return {
        status: 'error',
        message: 'Failed to fetch banners',
        error: error.message,
      };
    }
  }

  // async addbannerWithPhoto(bannerDto: any): Promise<{ status: string; message: string }> {
  //   try {
  //     // ✅ Log incoming body
  //     console.log('📥 Received banner data:', bannerDto);

  //     const {
  //       banner_note,
  //       banner_photo,
  //       banner_index,
  //       banner_status,
  //     } = bannerDto;

  //     const photoFilename = await this.saveBannerImage(banner_photo);

  //     const sql = `
  //       INSERT INTO kd_banner (
  //         banner_note, banner_photo, banner_date, banner_index, banner_status
  //       ) VALUES (?, ?, NOW(), ?, ?)
  //     `;

  //     const values = [banner_note, photoFilename, banner_index, banner_status];

  //     // ✅ Log SQL statement and values
  //     console.log('📦 Executing SQL:', sql);
  //     console.log('🧾 Values:', values);

  //     await this.dataSource.query(sql, values);

  //     // ✅ Confirm success
  //     console.log('✅ Banner created with photo:', photoFilename);

  //     return {
  //       status: 'success',
  //       message: 'Banner created successfully',
  //     };
  //   } catch (error) {
  //     console.error('❌ Error creating banner:', error.message);
  //     throw new HttpException(
  //       {
  //         status: 'error',
  //         message: 'Failed to create banner',
  //         error: error.message,
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async addbannerWithPhoto(bannerDto: any): Promise<{ status: string; message: string }> {
    try {
      // ✅ Log incoming body
      console.log('📥 Received banner data:', bannerDto);

      const {
        banner_note,
        banner_photo,
        banner_index,
        banner_status,
        banner_link, // <-- Extract banner_link
      } = bannerDto;

      const photoFilename = await this.saveBannerImage(banner_photo);

      const sql = `
      INSERT INTO kd_banner (
        banner_note, banner_photo, banner_date, banner_index, banner_status, banner_link
      ) VALUES (?, ?, NOW(), ?, ?, ?)
    `;

      const values = [banner_note, photoFilename, banner_index, banner_status, banner_link];

      // ✅ Log SQL statement and values
      console.log('📦 Executing SQL:', sql);
      console.log('🧾 Values:', values);

      await this.dataSource.query(sql, values);

      // ✅ Confirm success
      console.log('✅ Banner created with photo:', photoFilename);

      return {
        status: 'success',
        message: 'Banner created successfully',
      };
    } catch (error) {
      console.error('❌ Error creating banner:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create banner',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveBannerImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'banner');
      await fs.mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueName);

      await fs.writeFile(filePath, data, 'base64');
      return uniqueName;
    } catch (error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  async putUpdateBanner(id: number, bannerDto: any): Promise<{ status: string; message: string }> {
    try {
      console.log('📥 Received update data:', bannerDto);

      const {
        banner_note,
        banner_photo,   // base64 or null
        banner_index,
        banner_status,
        banner_link,
      } = bannerDto;

      let photoFilename = null;

      if (banner_photo) {
        // Save new photo if provided (base64)
        photoFilename = await this.saveBannerImage(banner_photo);
      }

      // Build SQL with conditional update for photo
      const values: any[] = [banner_note, banner_index, banner_status, banner_link, id];

      let sql = `
      UPDATE kd_banner 
      SET banner_note = ?, banner_index = ?, banner_status = ?, banner_link = ?
    `;

      if (photoFilename) {
        sql += `, banner_photo = ? `;
        // Insert photoFilename before id
        values.splice(values.length - 1, 0, photoFilename);
      }

      sql += ` WHERE banner_id = ?`;

      console.log('📦 Executing SQL:', sql);
      console.log('🧾 Values:', values);

      await this.dataSource.query(sql, values);

      console.log('✅ Banner updated:', id);

      return {
        status: 'success',
        message: 'Banner updated successfully',
      };
    } catch (error) {
      console.error('❌ Error updating banner:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update banner',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBanner(id: number): Promise<{ status: string; message: string }> {
    try {
      await this.dataSource.query(`DELETE FROM kd_banner WHERE banner_id = ?`, [id]);
      return {
        status: 'success',
        message: `Banner with ID ${id} deleted successfully`,
      };
    } catch (error) {
      console.error('❌ Error deleting banner:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete banner',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }




  // =================== CUSTOMER WITH BALANCE METHODS ===================

  // Get customer with current balance
  async getCustomerWithBalance(customerId?: number, phone?: string): Promise<any> {
    try {
      let whereClause = '';
      const params = [];

      if (customerId) {
        whereClause = 'WHERE c.customer_id = ?';
        params.push(customerId);
      } else if (phone) {
        whereClause = 'WHERE c.phone = ?';
        params.push(phone);
      } else {
        return {
          status: 'error',
          message: 'Either customerId or phone is required',
        };
      }

      const query = `
        SELECT 
          c.*,
          COALESCE(t.calculated_balance, 0) as live_balance,
          COALESCE(s.statement_balance, 0) as statement_balance,
          COALESCE(t.last_txn_date, c.created_at) as last_activity_date,
          COALESCE(t.total_transactions, 0) as total_transactions,
          COALESCE(t.total_earned, 0) as total_earned,
          COALESCE(t.total_spent, 0) as total_spent,
          CASE 
            WHEN c.current_balance = COALESCE(t.calculated_balance, 0) THEN 'SYNCED'
            ELSE 'OUT_OF_SYNC'
          END as balance_status,
          CASE 
            WHEN COALESCE(t.calculated_balance, 0) >= 10000 THEN 'PLATINUM'
            WHEN COALESCE(t.calculated_balance, 0) >= 5000 THEN 'GOLD'
            WHEN COALESCE(t.calculated_balance, 0) >= 1000 THEN 'SILVER'
            ELSE 'BRONZE'
          END as tier
        FROM kd_customer c
        LEFT JOIN (
          SELECT 
            COALESCE(txn.phone, txn.phone_to) as customer_phone,
            SUM(CASE 
              WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'TRANSFER' AND txn.phone_to = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN -CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'ADJUST' AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              ELSE 0 
            END) as calculated_balance,
            SUM(CASE WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') THEN txn.point ELSE 0 END) as total_earned,
            SUM(CASE WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') THEN txn.point ELSE 0 END) as total_spent,
            COUNT(*) as total_transactions,
            MAX(txn.created_at) as last_txn_date
          FROM kd_txn txn
          GROUP BY COALESCE(txn.phone, txn.phone_to)
        ) t ON c.phone = t.customer_phone
        LEFT JOIN (
          SELECT 
            phone_cust,
            MAX(point_total) as statement_balance
          FROM kd_sttm 
          GROUP BY phone_cust
        ) s ON c.phone = s.phone_cust
        ${whereClause}
      `;

      const result = await this.dataSource.query(query, params);

      if (result.length === 0) {
        return {
          status: 'error',
          message: 'Customer not found',
        };
      }

      return {
        status: 'success',
        message: 'Customer data with balance fetched successfully',
        data: result[0],
      };

    } catch (error) {
      console.error('Error fetching customer with balance:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch customer with balance',
        error: error.message,
      };
    }
  }

  // Get all customers with balance
  async getAllCustomersWithBalance(limit: number = 50, offset: number = 0): Promise<any> {
    try {
      const query = `
        SELECT 
          c.customer_id,
          c.name,
          c.username,
          c.phone,
          c.email,
          c.status,
          c.current_balance,
          c.last_transaction_date,
          COALESCE(t.calculated_balance, 0) as live_balance,
          COALESCE(t.total_transactions, 0) as total_transactions,
          COALESCE(t.total_earned, 0) as total_earned,
          COALESCE(t.total_spent, 0) as total_spent,
          CASE 
            WHEN c.current_balance = COALESCE(t.calculated_balance, 0) THEN 'SYNCED'
            ELSE 'OUT_OF_SYNC'
          END as balance_status,
          CASE 
            WHEN COALESCE(t.calculated_balance, 0) >= 10000 THEN 'PLATINUM'
            WHEN COALESCE(t.calculated_balance, 0) >= 5000 THEN 'GOLD'
            WHEN COALESCE(t.calculated_balance, 0) >= 1000 THEN 'SILVER'
            ELSE 'BRONZE'
          END as tier
        FROM kd_customer c
        LEFT JOIN (
          SELECT 
            COALESCE(txn.phone, txn.phone_to) as customer_phone,
            SUM(CASE 
              WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'TRANSFER' AND txn.phone_to = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN -CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'ADJUST' AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              ELSE 0 
            END) as calculated_balance,
            SUM(CASE WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') THEN txn.point ELSE 0 END) as total_earned,
            SUM(CASE WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') THEN txn.point ELSE 0 END) as total_spent,
            COUNT(*) as total_transactions
          FROM kd_txn txn
          GROUP BY COALESCE(txn.phone, txn.phone_to)
        ) t ON c.phone = t.customer_phone
        ORDER BY COALESCE(t.calculated_balance, 0) DESC
        LIMIT ? OFFSET ?
      `;

      const result = await this.dataSource.query(query, [limit, offset]);

      // Get total count
      const countQuery = 'SELECT COUNT(*) as total FROM kd_customer';
      const countResult = await this.dataSource.query(countQuery);

      return {
        status: 'success',
        message: 'Customers with balance fetched successfully',
        data: {
          customers: result,
          pagination: {
            total: countResult[0].total,
            limit: limit,
            offset: offset,
            has_more: (offset + limit) < countResult[0].total
          }
        },
      };

    } catch (error) {
      console.error('Error fetching customers with balance:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch customers with balance',
        error: error.message,
      };
    }
  }

  // Get customer leaderboard
  async getCustomerLeaderboard(limit: number = 20): Promise<any> {
    try {
      const query = `
        SELECT 
          c.customer_id,
          c.name,
          c.username,
          c.phone,
          COALESCE(t.calculated_balance, 0) as current_balance,
          c.last_transaction_date,
          RANK() OVER (ORDER BY COALESCE(t.calculated_balance, 0) DESC) as balance_rank,
          COALESCE(t.total_transactions, 0) as total_transactions,
          COALESCE(t.total_earned, 0) as total_earned,
          COALESCE(t.total_spent, 0) as total_spent,
          CASE 
            WHEN COALESCE(t.calculated_balance, 0) >= 10000 THEN 'PLATINUM'
            WHEN COALESCE(t.calculated_balance, 0) >= 5000 THEN 'GOLD'
            WHEN COALESCE(t.calculated_balance, 0) >= 1000 THEN 'SILVER'
            ELSE 'BRONZE'
          END as tier
        FROM kd_customer c
        LEFT JOIN (
          SELECT 
            COALESCE(txn.phone, txn.phone_to) as customer_phone,
            SUM(CASE 
              WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'TRANSFER' AND txn.phone_to = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN -CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'ADJUST' AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              ELSE 0 
            END) as calculated_balance,
            SUM(CASE WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') THEN txn.point ELSE 0 END) as total_earned,
            SUM(CASE WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') THEN txn.point ELSE 0 END) as total_spent,
            COUNT(*) as total_transactions
          FROM kd_txn txn
          GROUP BY COALESCE(txn.phone, txn.phone_to)
        ) t ON c.phone = t.customer_phone
        WHERE c.status = 'ACTIVE'
        ORDER BY COALESCE(t.calculated_balance, 0) DESC
        LIMIT ?
      `;

      const result = await this.dataSource.query(query, [limit]);

      return {
        status: 'success',
        message: 'Customer leaderboard fetched successfully',
        data: result,
      };

    } catch (error) {
      console.error('Error fetching customer leaderboard:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch customer leaderboard',
        error: error.message,
      };
    }
  }

  // =================== BALANCE SYNC METHODS ===================

  // Sync customer balance with transaction system
  async syncCustomerBalance(phone: string): Promise<any> {
    try {
      // Calculate balance from transactions
      const balanceQuery = `
        SELECT 
          COALESCE(SUM(CASE 
            WHEN txn_type IN ('Get Point', 'EARN', 'BONUS') THEN CAST(point AS SIGNED)
            WHEN txn_type = 'TRANSFER' AND phone_to = ? THEN CAST(point AS SIGNED)
            WHEN txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') AND phone = ? THEN -CAST(point AS SIGNED)
            WHEN txn_type = 'ADJUST' THEN CAST(point AS SIGNED)
            ELSE 0 
          END), 0) as calculated_balance,
          MAX(created_at) as last_txn_date
        FROM kd_txn 
        WHERE phone = ? OR phone_to = ?
      `;

      const balanceResult = await this.dataSource.query(balanceQuery, [phone, phone, phone, phone]);
      const calculatedBalance = Number(balanceResult[0]?.calculated_balance || 0);
      const lastTxnDate = balanceResult[0]?.last_txn_date || null;

      // Update customer table
      const updateQuery = `
        UPDATE kd_customer 
        SET 
          current_balance = ?,
          last_transaction_date = ?,
          updated_at = NOW()
        WHERE phone = ?
      `;

      await this.dataSource.query(updateQuery, [calculatedBalance, lastTxnDate, phone]);

      return {
        status: 'success',
        message: 'Customer balance synced successfully',
        data: {
          phone: phone,
          new_balance: calculatedBalance,
          last_transaction: lastTxnDate,
          sync_status: 'COMPLETED'
        },
      };

    } catch (error) {
      console.error('Error syncing customer balance:', error.message);
      return {
        status: 'error',
        message: 'Failed to sync customer balance',
        error: error.message,
      };
    }
  }

  // Sync all customer balances
  async syncAllCustomerBalances(): Promise<any> {
    try {
      console.log('🔄 Starting customer balance sync...');

      // Get all customers with phone numbers
      const customersQuery = 'SELECT phone FROM kd_customer WHERE phone IS NOT NULL';
      const customers = await this.dataSource.query(customersQuery);

      let syncedCount = 0;
      let failedCount = 0;

      for (const customer of customers) {
        try {
          await this.syncCustomerBalance(customer.phone);
          syncedCount++;
        } catch (error) {
          console.error(`Failed to sync balance for ${customer.phone}:`, error.message);
          failedCount++;
        }
      }

      console.log(`✅ Sync completed: ${syncedCount} synced, ${failedCount} failed`);

      return {
        status: 'success',
        message: 'Customer balance sync completed',
        data: {
          customers_processed: customers.length,
          synced_successfully: syncedCount,
          failed: failedCount,
          sync_completion_time: new Date().toISOString()
        },
      };

    } catch (error) {
      console.error('Error syncing all customer balances:', error.message);
      return {
        status: 'error',
        message: 'Failed to sync customer balances',
        error: error.message,
      };
    }
  }

  // =================== CUSTOMER ANALYTICS METHODS ===================

  // Get customer analytics
  async getCustomerAnalytics(): Promise<any> {
    try {
      const analyticsQuery = `
        SELECT 
          COUNT(*) as total_customers,
          COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_customers,
          COUNT(CASE WHEN status = 'INACTIVE' THEN 1 END) as inactive_customers,
          AVG(current_balance) as avg_balance,
          MAX(current_balance) as max_balance,
          MIN(current_balance) as min_balance,
          SUM(current_balance) as total_balance_in_system,
          COUNT(CASE WHEN current_balance > 0 THEN 1 END) as customers_with_balance,
          COUNT(CASE WHEN current_balance >= 10000 THEN 1 END) as platinum_customers,
          COUNT(CASE WHEN current_balance >= 5000 AND current_balance < 10000 THEN 1 END) as gold_customers,
          COUNT(CASE WHEN current_balance >= 1000 AND current_balance < 5000 THEN 1 END) as silver_customers,
          COUNT(CASE WHEN current_balance < 1000 THEN 1 END) as bronze_customers
        FROM kd_customer
      `;

      const analyticsResult = await this.dataSource.query(analyticsQuery);
      const analytics = analyticsResult[0];

      // Get recent activity
      const recentActivityQuery = `
        SELECT 
          COUNT(CASE WHEN last_transaction_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as active_last_7_days,
          COUNT(CASE WHEN last_transaction_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_last_30_days,
          COUNT(CASE WHEN last_transaction_date < DATE_SUB(NOW(), INTERVAL 30 DAY) OR last_transaction_date IS NULL THEN 1 END) as inactive_30_plus_days
        FROM kd_customer
      `;

      const activityResult = await this.dataSource.query(recentActivityQuery);
      const activity = activityResult[0];

      return {
        status: 'success',
        message: 'Customer analytics fetched successfully',
        data: {
          overview: {
            total_customers: Number(analytics.total_customers),
            active_customers: Number(analytics.active_customers),
            inactive_customers: Number(analytics.inactive_customers),
            customers_with_balance: Number(analytics.customers_with_balance)
          },
          balance_analytics: {
            total_balance_in_system: Number(analytics.total_balance_in_system),
            average_balance: Math.round(Number(analytics.avg_balance) || 0),
            max_balance: Number(analytics.max_balance),
            min_balance: Number(analytics.min_balance)
          },
          tier_distribution: {
            platinum: Number(analytics.platinum_customers),
            gold: Number(analytics.gold_customers),
            silver: Number(analytics.silver_customers),
            bronze: Number(analytics.bronze_customers)
          },
          activity_stats: {
            active_last_7_days: Number(activity.active_last_7_days),
            active_last_30_days: Number(activity.active_last_30_days),
            inactive_30_plus_days: Number(activity.inactive_30_plus_days)
          },
          generated_at: new Date().toISOString()
        },
      };

    } catch (error) {
      console.error('Error fetching customer analytics:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch customer analytics',
        error: error.message,
      };
    }
  }

  // Get customers by tier
  async getCustomersByTier(tier: string): Promise<any> {
    try {
      let minBalance = 0;
      let maxBalance = 999999999;

      switch (tier.toUpperCase()) {
        case 'PLATINUM':
          minBalance = 10000;
          break;
        case 'GOLD':
          minBalance = 5000;
          maxBalance = 9999;
          break;
        case 'SILVER':
          minBalance = 1000;
          maxBalance = 4999;
          break;
        case 'BRONZE':
          maxBalance = 999;
          break;
        default:
          return {
            status: 'error',
            message: 'Invalid tier. Use: PLATINUM, GOLD, SILVER, or BRONZE',
          };
      }

      const query = `
        SELECT 
          c.customer_id,
          c.name,
          c.username,
          c.phone,
          c.email,
          c.current_balance,
          c.last_transaction_date,
          c.status,
          COALESCE(t.total_transactions, 0) as total_transactions,
          COALESCE(t.total_earned, 0) as total_earned,
          COALESCE(t.total_spent, 0) as total_spent
        FROM kd_customer c
        LEFT JOIN (
          SELECT 
            COALESCE(txn.phone, txn.phone_to) as customer_phone,
            SUM(CASE WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') THEN txn.point ELSE 0 END) as total_earned,
            SUM(CASE WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') THEN txn.point ELSE 0 END) as total_spent,
            COUNT(*) as total_transactions
          FROM kd_txn txn
          GROUP BY COALESCE(txn.phone, txn.phone_to)
        ) t ON c.phone = t.customer_phone
        WHERE c.current_balance >= ? AND c.current_balance <= ?
        ORDER BY c.current_balance DESC
      `;

      const result = await this.dataSource.query(query, [minBalance, maxBalance]);

      return {
        status: 'success',
        message: `${tier} tier customers fetched successfully`,
        data: {
          tier: tier.toUpperCase(),
          balance_range: {
            min: minBalance,
            max: maxBalance === 999999999 ? 'unlimited' : maxBalance
          },
          customers: result,
          count: result.length
        },
      };

    } catch (error) {
      console.error('Error fetching customers by tier:', error.message);
      return {
        status: 'error',
        message: 'Failed to fetch customers by tier',
        error: error.message,
      };
    }
  }

  // =================== CUSTOMER SEARCH METHODS ===================

  // Search customers by various criteria
  async searchCustomers(searchTerm: string, searchBy: string = 'all'): Promise<any> {
    try {
      let whereClause = '';
      const params = [];

      switch (searchBy.toLowerCase()) {
        case 'name':
          whereClause = 'WHERE c.name LIKE ?';
          params.push(`%${searchTerm}%`);
          break;
        case 'phone':
          whereClause = 'WHERE c.phone LIKE ?';
          params.push(`%${searchTerm}%`);
          break;
        case 'email':
          whereClause = 'WHERE c.email LIKE ?';
          params.push(`%${searchTerm}%`);
          break;
        case 'username':
          whereClause = 'WHERE c.username LIKE ?';
          params.push(`%${searchTerm}%`);
          break;
        case 'all':
        default:
          whereClause = 'WHERE c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ? OR c.username LIKE ?';
          params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
          break;
      }

      const query = `
        SELECT 
          c.*,
          COALESCE(t.calculated_balance, 0) as live_balance,
          COALESCE(t.total_transactions, 0) as total_transactions,
          CASE 
            WHEN COALESCE(t.calculated_balance, 0) >= 10000 THEN 'PLATINUM'
            WHEN COALESCE(t.calculated_balance, 0) >= 5000 THEN 'GOLD'
            WHEN COALESCE(t.calculated_balance, 0) >= 1000 THEN 'SILVER'
            ELSE 'BRONZE'
          END as tier
        FROM kd_customer c
        LEFT JOIN (
          SELECT 
            COALESCE(txn.phone, txn.phone_to) as customer_phone,
            SUM(CASE 
              WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'TRANSFER' AND txn.phone_to = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN -CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'ADJUST' AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              ELSE 0 
            END) as calculated_balance,
            COUNT(*) as total_transactions
          FROM kd_txn txn
          GROUP BY COALESCE(txn.phone, txn.phone_to)
        ) t ON c.phone = t.customer_phone
        ${whereClause}
        ORDER BY COALESCE(t.calculated_balance, 0) DESC
        LIMIT 50
      `;

      const result = await this.dataSource.query(query, params);

      return {
        status: 'success',
        message: `Search results for "${searchTerm}"`,
        data: {
          search_term: searchTerm,
          search_by: searchBy,
          results: result,
          count: result.length
        },
      };

    } catch (error) {
      console.error('Error searching customers:', error.message);
      return {
        status: 'error',
        message: 'Failed to search customers',
        error: error.message,
      };
    }
  }
}



