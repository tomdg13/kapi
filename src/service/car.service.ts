import { CarDto } from 'src/dto/car.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, writeFile } from 'fs/promises'; // ✅ Promise version
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class CarService {
  constructor(private dataSource: DataSource) { }


  async findCarByDriverId(dto: CarDto): Promise<any> {
    try {
      const query = `SELECT * FROM kdv_car WHERE driver_id = ? AND is_deleted = 0 ORDER BY car_id ASC`;
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
        picture_plate_front: car.picture_plate_front ? imageBaseUrl + car.picture_plate_front : null,
        picture_plate_back: car.picture_plate_back ? imageBaseUrl + car.picture_plate_back : null,
        picture_left: car.picture_left ? imageBaseUrl + car.picture_left : null,
        picture_right: car.picture_right ? imageBaseUrl + car.picture_right : null,
        picture_insurance: car.picture_insurance ? imageBaseUrl + car.picture_insurance : null,
      }));

      return {
        status: 'success',
        message: 'Car data fetched successfully',
        data: updatedResult,
      };
    } catch (error) {
      console.error('Error fetching car data:', error);
      return {
        status: 'error',
        message: 'Failed to fetch car info',
        error: error.message,
      };
    }
  }



  async findCar(dto: CarDto): Promise<any> {
    try {
      const query = `SELECT * FROM kdv_car WHERE is_deleted = 0 ORDER BY car_id ASC`;
      const result = await this.dataSource.query(query);

      
      const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/car/`;

      const carsWithPhotos = result.map((car: any) => ({
        ...car,
        picture1: car.picture1 != null ? imageBaseUrl + car.picture1 : null,
        picture2: car.picture2 != null ? imageBaseUrl + car.picture2 : null,
        picture3: car.picture3 != null ? imageBaseUrl + car.picture3 : null,
        picture_id: car.picture_id != null ? imageBaseUrl + car.picture_id : null,
        picture_plate_front: car.picture_plate_front != null ? imageBaseUrl + car.picture_plate_front : null,
        picture_plate_back: car.picture_plate_back != null ? imageBaseUrl + car.picture_plate_back : null,
        picture_left: car.picture_left != null ? imageBaseUrl + car.picture_left : null,
        picture_right: car.picture_right != null ? imageBaseUrl + car.picture_right : null,
        picture_insurance: car.picture_insurance != null ? imageBaseUrl + car.picture_insurance : null,
      }));

      return {
        status: 'success',
        message: 'All cars fetched (role ignored)',
        data: carsWithPhotos,
      };
    } catch (error) {
      console.error('Error fetching cars:', error);
      return {
        status: 'error',
        message: 'Failed to fetch cars',
        error: error.message,
      };
    }
  }

  async addCar(carDto: any): Promise<{ status: string; message: string; car_id?: number }> {
    try {
      const {
        brand,
        model,
        model_year,
        color,
        engine_number,
        chassis_number,
        fuel_type,
        owner_name,
        registered_date,
        picture1,
        picture2,
        picture3,
        picture_id,
        picture_plate_front,
        picture_plate_back,
        picture_left,
        picture_right,
        picture_insurance,
        license_plate,
        car_province_id,
        car_type_id,
        driver_id,
        insurance_no,
        insurance_date,
        car_status,
      } = carDto;

      const picture1Filename = await this.saveImage(picture1);
      const picture2Filename = await this.saveImage(picture2);
      const picture3Filename = await this.saveImage(picture3);
      const pictureIdFilename = await this.saveImage(picture_id);
      const picturePlateFrontFilename = await this.saveImage(picture_plate_front);
      const picturePlateBackFilename = await this.saveImage(picture_plate_back);
      const pictureLeftFilename = await this.saveImage(picture_left);
      const pictureRightFilename = await this.saveImage(picture_right);
      const pictureInsuranceFilename = await this.saveImage(picture_insurance);

      const escapeValue = (value: any): string => {
        if (value === null || value === undefined) return 'NULL';
        return typeof value === 'string'
          ? `'${value.replace(/'/g, "''")}'`
          : String(value);
      };

      const sql = `
      INSERT INTO kd_car (
        brand, model, model_year, color, engine_number, chassis_number, fuel_type, owner_name, registered_date,
        picture1, picture2, picture3, picture_id,
        picture_plate_front, picture_plate_back, picture_left, picture_right, picture_insurance,
        license_plate, car_province_id, car_type_id, driver_id,
        insurance_no, insurance_date, car_status
      ) VALUES (
        ${escapeValue(brand)},
        ${escapeValue(model)},
        ${escapeValue(model_year)},
        ${escapeValue(color)},
        ${escapeValue(engine_number)},
        ${escapeValue(chassis_number)},
        ${escapeValue(fuel_type)},
        ${escapeValue(owner_name)},
        ${escapeValue(registered_date)},
        ${escapeValue(picture1Filename)},
        ${escapeValue(picture2Filename)},
        ${escapeValue(picture3Filename)},
        ${escapeValue(pictureIdFilename)},
        ${escapeValue(picturePlateFrontFilename)},
        ${escapeValue(picturePlateBackFilename)},
        ${escapeValue(pictureLeftFilename)},
        ${escapeValue(pictureRightFilename)},
        ${escapeValue(pictureInsuranceFilename)},
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
    } catch (error) {
      console.error('Error creating car:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create car',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }




  private async saveImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'car');
      await mkdir(uploadPath, { recursive: true });

      const { mimeType, data } = this.parseBase64Image(base64Str);
      const ext = this.getFileExtension(mimeType);
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadPath, uniqueName);

      await writeFile(filePath, Buffer.from(data, 'base64'));
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

 async updateCar(carDto: any): Promise<{ status: string; message: string }> {
  try {
    const {
      car_id,
      brand,
      model,
      model_year,
      color,
      engine_number,
      chassis_number,
      fuel_type,
      owner_name,
      registered_date,
      picture1,
      picture2,
      picture3,
      picture_id,
      picture_plate_front,
      picture_plate_back,
      picture_left,
      picture_right,
      picture_insurance,
      license_plate,
      car_province_id,
      car_type_id,
      driver_id,
      insurance_no,
      insurance_date,
      car_status
    } = carDto;

    if (!car_id) {
      throw new Error('Missing car_id for update');
    }

    const picture1Filename = picture1 ? await this.saveImage(picture1) : null;
    const picture2Filename = picture2 ? await this.saveImage(picture2) : null;
    const picture3Filename = picture3 ? await this.saveImage(picture3) : null;
    const pictureIdFilename = picture_id ? await this.saveImage(picture_id) : null;
    const picturePlateFrontFilename = picture_plate_front ? await this.saveImage(picture_plate_front) : null;
    const picturePlateBackFilename = picture_plate_back ? await this.saveImage(picture_plate_back) : null;
    const pictureLeftFilename = picture_left ? await this.saveImage(picture_left) : null;
    const pictureRightFilename = picture_right ? await this.saveImage(picture_right) : null;
    const pictureInsuranceFilename = picture_insurance ? await this.saveImage(picture_insurance) : null;

    const escape = (val: string) => val.replace(/'/g, "''");

    const updates: string[] = [];

    if (brand) updates.push(`brand = '${escape(brand)}'`);
    if (model) updates.push(`model = '${escape(model)}'`);
    if (model_year) updates.push(`model_year = '${escape(model_year)}'`);
    if (color) updates.push(`color = '${escape(color)}'`);
    if (engine_number) updates.push(`engine_number = '${escape(engine_number)}'`);
    if (chassis_number) updates.push(`chassis_number = '${escape(chassis_number)}'`);
    if (fuel_type) updates.push(`fuel_type = '${escape(fuel_type)}'`);
    if (owner_name) updates.push(`owner_name = '${escape(owner_name)}'`);
    if (registered_date) updates.push(`registered_date = '${escape(registered_date)}'`);
    if (picture1Filename) updates.push(`picture1 = '${escape(picture1Filename)}'`);
    if (picture2Filename) updates.push(`picture2 = '${escape(picture2Filename)}'`);
    if (picture3Filename) updates.push(`picture3 = '${escape(picture3Filename)}'`);
    if (pictureIdFilename) updates.push(`picture_id = '${escape(pictureIdFilename)}'`);
    if (picturePlateFrontFilename) updates.push(`picture_plate_front = '${escape(picturePlateFrontFilename)}'`);
    if (picturePlateBackFilename) updates.push(`picture_plate_back = '${escape(picturePlateBackFilename)}'`);
    if (pictureLeftFilename) updates.push(`picture_left = '${escape(pictureLeftFilename)}'`);
    if (pictureRightFilename) updates.push(`picture_right = '${escape(pictureRightFilename)}'`);
    if (pictureInsuranceFilename) updates.push(`picture_insurance = '${escape(pictureInsuranceFilename)}'`);
    if (license_plate) updates.push(`license_plate = '${escape(license_plate)}'`);
    if (car_province_id !== undefined) updates.push(`car_province_id = ${car_province_id}`);
    if (car_type_id !== undefined) updates.push(`car_type_id = ${car_type_id}`);
    if (driver_id !== undefined) updates.push(`driver_id = ${driver_id}`);
    if (insurance_no) updates.push(`insurance_no = '${escape(insurance_no)}'`);
    if (insurance_date) updates.push(`insurance_date = '${escape(insurance_date)}'`);
    if (car_status) updates.push(`car_status = '${escape(car_status)}'`);

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
  } catch (error) {
    console.error('Error updating car:', error.message);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to update car',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}



  async updateCarKyc(body: any): Promise<any> {
    const { car_id, kyc_status, kyc_note, kyc_date } = body;
    if (!car_id) throw new Error('Missing car_id');
    await this.dataSource.query(
      `UPDATE kd_car SET kyc_status = ?, kyc_note = ?, kyc_date = ? WHERE car_id = ?`,
      [kyc_status, kyc_note ?? null, kyc_date ?? null, car_id],
    );
    return { status: 'success', message: 'KYC updated' };
  }

  async deleteCar(body: any): Promise<any> {
    const { car_id, deleted_by } = body;
    if (!car_id) throw new Error('Missing car_id');

    const existing = await this.dataSource.query(
      `SELECT car_id, is_deleted FROM kd_car WHERE car_id = ?`,
      [car_id],
    );

    if (existing.length === 0) {
      return { status: 'not_found', message: 'Car not found' };
    }
    if (existing[0].is_deleted === 1) {
      return { status: 'error', message: 'Car already deleted' };
    }

    await this.dataSource.query(
      `UPDATE kd_car SET is_deleted = 1, deleted_at = NOW(), deleted_by = ? WHERE car_id = ?`,
      [deleted_by ?? null, car_id],
    );

    return { status: 'success', message: 'Car deleted successfully' };
  }

}
