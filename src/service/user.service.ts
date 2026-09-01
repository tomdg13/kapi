
import { CreateUserDto, UserDto } from 'src/dto/user.dto'; 
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class userService {
  constructor(private dataSource: DataSource) { }

  async findUserById(dto: UserDto): Promise<any> {
    try {
      const query = `SELECT * FROM kd_user WHERE user_id = ?`;
      const result = await this.dataSource.query(query, [dto.id]);

      if (result.length === 0) {
        return {
          status: 'not_found',
          message: `User with ID ${dto.id} not found`,
          data: [],
        };
      }

      return {
        status: 'success',
        message: 'User fetched successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        status: 'error',
        message: 'Failed to fetch user info',
        error: error.message,
      };
    }
  }

  async findUsersByRole(dto: UserDto): Promise<any> {
  try {
    let query: string;
    let params: any[] = [];

    if (dto.role.toLowerCase() === 'admin') {
      // Admin: show all users
      query = `SELECT * FROM kd_user`;
    } else {
      // Non-admin: filter by role
      query = `SELECT * FROM kd_user WHERE role = ?`;
      params.push(dto.role);
    }

    const result = await this.dataSource.query(query, params);

    // Base URL where photos are hosted
   
    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/user/`;

    // Append full photo URLs
    const usersWithPhotos = result.map((user: any) => ({
      ...user,
      photo: user.photo ? imageBaseUrl + user.photo : null,
      photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
    }));

    return {
      status: 'success',
      message: dto.role.toLowerCase() === 'admin' ? 'All users fetched' : `Users with role ${dto.role} fetched`,
      data: usersWithPhotos,
    };
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return {
      status: 'error',
      message: 'Failed to fetch users',
      error: error.message,
    };
  }
}


async findAllCustomer(): Promise<any> {
  try {
    let query: string = `SELECT * FROM kdv_customer_address`;
    const params: any[] = [];

    const result = await this.dataSource.query(query, params);

 
    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/customer/`;



    const customersWithPhotos = result.map((user: any) => ({
      ...user,
      photo: user.photo ? imageBaseUrl + user.photo : null,
      photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
    }));

    return {
      status: 'success',
      message: 'All customers fetched successfully',
      data: customersWithPhotos,
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      status: 'error',
      message: 'Failed to fetch customers',
      error: error.message,
    };
  }
}

async findAllDriver(): Promise<any> {
  try {
    let query: string = `SELECT * FROM kdv_Driver_address`;
    const params: any[] = [];

    const result = await this.dataSource.query(query, params);

    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/driver/`;


    const DriversWithPhotos = result.map((user: any) => ({
      ...user,
      photo: user.photo ? imageBaseUrl + user.photo : null,
      photo_id: user.photo_id ? imageBaseUrl + user.photo_id : null,
    }));

    return {
      status: 'success',
      message: 'All Drivers fetched successfully',
      data: DriversWithPhotos,
    };
  } catch (error) {
    console.error('Error fetching Drivers:', error);
    return {
      status: 'error',
      message: 'Failed to fetch Drivers',
      error: error.message,
    };
  }
}

  async findAllcartype(brand_id?: number): Promise<any> {
    try {
      let query = `SELECT * FROM kd_cartype`;
      let params: any[] = [];
      if (brand_id) {
        query = `SELECT ct.* FROM kd_cartype ct
                 INNER JOIN car_brand_type cbt ON cbt.car_type_id = ct.car_type_id
                 WHERE cbt.brand_id = ?
                 ORDER BY ct.index_price`;
        params = [brand_id];
      } else {
        query += ` order by index_price`;
      }
      const result = await this.dataSource.query(query, params);

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
      order by vill_name  )`;
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

  async addUserWithPhoto(userDto: any): Promise<{ status: string; message: string }> {
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
      } = userDto;

      const photoFilename = await this.saveImage(photo);
      const photoIdFilename = await this.saveImage(photo_id);

      const escapeValue = (value: any): string => {
        if (value === null || value === undefined) return 'NULL';
        return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : String(value);
      };

      const sql = `
        INSERT INTO kd_user (
           name, username, email, password, phone, document_id,
          photo, photo_id, village_id, district_id, province_id,
          status, role, account_bank_id, account_no, account_name, language,bio , online
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
          ${escapeValue(online)},
          ${escapeValue(bio)}
          
        )`;

      console.log('Executing SQL:', sql);
      await this.dataSource.query(sql);

      return {
        status: 'success',
        message: 'User created successfully',
      };
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveImage(base64Str: string | null): Promise<string | null> {
    if (!base64Str) return null;

    try {
      const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'user');
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


async updateUserWithPhoto( //null notupdate
  phone: string,
  userDto: any,
): Promise<{ status: string; message: string }> {
  try {
    console.log('📝 Received userDto:', JSON.stringify(userDto, null, 2));

    const {
      name,
      username,
      email,
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
      online,
      bio,
    } = userDto;

    // Find existing user
    const [existingUser] = await this.dataSource.query(
      `SELECT photo, photo_id FROM kd_user WHERE phone = ?`,
      [phone],
    );
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Handle photos: use new photo if provided, else existing one
    const photoFilename = photo ? await this.saveImage(photo) : existingUser.photo;
    const photoIdFilename = photo_id ? await this.saveImage(photo_id) : existingUser.photo_id;

    // Prepare fields to update dynamically
    const updates: string[] = [];
    const values: any[] = [];

    // Helper to add field only if value is not null or undefined
    function addField(fieldName: string, value: any) {
      if (value !== null && value !== undefined) {
        updates.push(`${fieldName} = ?`);
        values.push(value);
      }
    }

    addField('name', name);
    addField('username', username);
    addField('email', email);
    addField('phone', newPhone);
    addField('document_id', document_id);
    addField('photo', photoFilename);
    addField('photo_id', photoIdFilename);
    addField('village_id', village_id);
    addField('district_id', district_id);
    addField('province_id', province_id);
    addField('status', status);
    addField('role', role);
    addField('account_bank_id', account_bank_id);
    addField('account_no', account_no);
    addField('account_name', account_name);
    addField('bio', bio);
    addField('online', online);
    addField('language', language);

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Add WHERE condition value
    values.push(phone);

    const sql = `
      UPDATE kd_user SET
        ${updates.join(', ')}
      WHERE phone = ?
    `;

    console.log('🧾 Executing SQL:\n', sql);
    console.log('📦 With values:', values);

    await this.dataSource.query(sql, values);

    console.log('✅ User update complete for phone:', phone);
    return {
      status: 'success',
      message: 'User updated successfully',
    };
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to update user',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async updateDriver(
  phone: string,
  driverDto: any,
): Promise<{ status: string; message: string }> {
  try {
    console.log('📝 Received driverDto:', JSON.stringify(driverDto, null, 2));

    const {
      name,
      username,
      email,
      phone: newPhone, // Avoid shadowing
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
      online,
      bio,
    } = driverDto;

    // 1. Check if driver exists
    const [existingDriver] = await this.dataSource.query(
      `SELECT photo, photo_id FROM kd_driver WHERE phone = ?`,
      [phone],
    );
    if (!existingDriver) {
      throw new Error('Driver not found');
    }

    // 2. Handle photos: keep existing if new not provided
    const photoFilename = photo ? await this.saveImage(photo) : existingDriver.photo;
    const photoIdFilename = photo_id ? await this.saveImage(photo_id) : existingDriver.photo_id;

    // 3. Prepare dynamic update
    const updates: string[] = [];
    const values: any[] = [];

    function addField(fieldName: string, value: any) {
      if (value !== null && value !== undefined) {
        updates.push(`${fieldName} = ?`);
        values.push(value);
      }
    }

    addField('name', name);
    addField('username', username);
    addField('email', email);
    addField('phone', newPhone);
    addField('document_id', document_id);
    addField('photo', photoFilename);
    addField('photo_id', photoIdFilename);
    addField('village_id', village_id);
    addField('district_id', district_id);
    addField('province_id', province_id);
    addField('status', status);
    addField('role', role);
    addField('account_bank_id', account_bank_id);
    addField('account_no', account_no);
    addField('account_name', account_name);
    addField('language', language);
    addField('online', online);
    addField('bio', bio);

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(phone); // Add for WHERE clause

    const sql = `
      UPDATE kd_driver SET
        ${updates.join(', ')}
      WHERE phone = ?
    `;

    console.log('🧾 Executing SQL:\n', sql);
    console.log('📦 With values:', values);

    await this.dataSource.query(sql, values);

    console.log('✅ Driver update complete for phone:', phone);
    return {
      status: 'success',
      message: 'Driver updated successfully',
    };
  } catch (error) {
    console.error('❌ Error updating driver:', error.message);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to update driver',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async findDriverByPhone(phone: string): Promise<any> {
  try {
    const query = `SELECT * FROM kdv_Driver_address WHERE phone = ?`;
    const result = await this.dataSource.query(query, [phone]);

    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/driver/`;

    const DriversWithPhotos = result.map((driver: any) => ({
      ...driver,
      photo: driver.photo ? imageBaseUrl + driver.photo : null,
      photo_id: driver.photo_id ? imageBaseUrl + driver.photo_id : null,
    }));

    if (DriversWithPhotos.length === 0) {
      return {
        status: 'error',
        message: 'Driver not found',
      };
    }

    return {
      status: 'success',
      message: 'Driver fetched successfully',
      data: DriversWithPhotos[0], // Return one driver
    };
  } catch (error) {
    console.error('Error fetching Driver:', error);
    return {
      status: 'error',
      message: 'Failed to fetch Driver',
      error: error.message,
    };
  }
}

async findCustomerByPhone(phone: string): Promise<any> {
  try {
    const query = `SELECT * FROM kdv_customer_address WHERE phone = ?`;
    const result = await this.dataSource.query(query, [phone]);

  
    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/customer/`;

    const CustomersWithPhotos = result.map((customer: any) => ({
      ...customer,
      photo: customer.photo ? imageBaseUrl + customer.photo : null,
      photo_id: customer.photo_id ? imageBaseUrl + customer.photo_id : null,
    }));

    if (CustomersWithPhotos.length === 0) {
      return {
        status: 'error',
        message: 'Customer not found',
      };
    }

    return {
      status: 'success',
      message: 'Customer fetched successfully',
      data: CustomersWithPhotos[0], // Return one customer
    };
  } catch (error) {
    console.error('Error fetching Customer:', error);
    return {
      status: 'error',
      message: 'Failed to fetch Customer',
      error: error.message,
    };
  }
}



async updateCustomer(   //null notupdate
  phone: string,
  userDto: any,
): Promise<{ status: string; message: string }> {
  try {
    console.log('📝 Received userDto:', JSON.stringify(userDto, null, 2));

    const {
      name,
      username,
      email,
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
      online,
      bio,
    } = userDto;

    // Find existing user in kd_customer
    const [existingUser] = await this.dataSource.query(
      `SELECT photo, photo_id FROM kd_customer WHERE phone = ?`,
      [phone],
    );
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Handle photos: use new photo if provided, else existing one
    const photoFilename = photo ? await this.saveImage(photo) : existingUser.photo;
    const photoIdFilename = photo_id ? await this.saveImage(photo_id) : existingUser.photo_id;

    // Prepare fields to update dynamically
    const updates: string[] = [];
    const values: any[] = [];

    function addField(fieldName: string, value: any) {
      if (value !== null && value !== undefined) {
        updates.push(`${fieldName} = ?`);
        values.push(value);
      }
    }

    addField('name', name);
    addField('username', username);
    addField('email', email);
    addField('phone', newPhone);
    addField('document_id', document_id);
    addField('photo', photoFilename);
    addField('photo_id', photoIdFilename);
    addField('village_id', village_id);
    addField('district_id', district_id);
    addField('province_id', province_id);
    addField('status', status);
    addField('role', role);
    addField('account_bank_id', account_bank_id);
    addField('account_no', account_no);
    addField('account_name', account_name);
    addField('bio', bio);
    addField('online', online);
    addField('language', language);

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(phone);

    const sql = `
      UPDATE kd_customer SET
        ${updates.join(', ')}
      WHERE phone = ?
    `;

    console.log('🧾 Executing SQL:\n', sql);
    console.log('📦 With values:', values);

    await this.dataSource.query(sql, values);

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

async addProfileImage(profileDto: {
  customer_id: number;
  profile_image: string; // base64 image string
  role?: string;          // new field
  
}): Promise<{ status: string; message: string }> {
  try {
    const { customer_id, profile_image,role  } = profileDto;
const roleValue = role ?? null;
    console.log('📥 Received profileDto:', JSON.stringify(profileDto, null, 2));

    if (!profile_image) {
      console.warn('⚠️ Missing profile image');
      throw new Error('Missing image');
    }

    // Save image to disk
    const savedFilename = await this.saveProfileImage(profile_image);
    console.log('💾 Saved image filename:', savedFilename);

    // Insert record to kd_profile
    const query = `
      INSERT INTO kd_profile (profile_image, customer_id, profile_date,role )
      VALUES (?, ?, NOW(),?)
    `;
    console.log('🧾 Executing SQL:', query);
    console.log('📦 With values:', [savedFilename, customer_id,role ]);

    await this.dataSource.query(query, [savedFilename, customer_id,roleValue ]);

    console.log('✅ Profile image uploaded for customer_id:', customer_id,role );

    return {
      status: 'success',
      message: 'Profile image uploaded and saved successfully',
    };
  } catch (error) {
    console.error('❌ Error in addProfileImage:', error.message);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to upload profile image',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


private async saveProfileImage(base64Str: string): Promise<string> {
  try {
    const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'profile');
    await fs.mkdir(uploadPath, { recursive: true });

    const { mimeType, data } = this.parseBase64Image(base64Str);
    const ext = this.getFileExtension(mimeType);
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(uploadPath, filename);

    await fs.writeFile(filePath, data, 'base64');
    return filename;
  } catch (error) {
    throw new Error(`Failed to save profile image: ${error.message}`);
  }
}


// async getProfileImageByCustomerId(phone: number): Promise<any> {
//   try {
//     const result = await this.dataSource.query(
//       `SELECT * FROM kdv_profile WHERE phone = ? ORDER BY profile_date DESC LIMIT 1`,
//       [phone],
//     );

//     if (result.length === 0) {
//       return {
//         status: 'not_found',
//         message: `No profile image found for phone ${phone}`,
//         data: null,
//       };
//     }

//     // Add full image URL to the result object
//     const baseUrl = 'http://209.97.172.105:3000/public/images/profile/';
//     const profileData = {
//       ...result[0],
//       profile_image_url: baseUrl + result[0].profile_image,
//     };

//     return {
//       status: 'success',
//       message: 'Profile fetched successfully',
//       data: profileData,
//     };
//   } catch (error) {
//     console.error('❌ Error fetching profile:', error.message);
//     throw new HttpException(
//       {
//         status: 'error',
//         message: 'Failed to fetch profile',
//         error: error.message,
//       },
//       HttpStatus.INTERNAL_SERVER_ERROR,
//     );
//   }
// }

async getProfileImageByCustomerId(user: { phone: number; role: string }): Promise<any> {
  const { phone, role } = user;

  try {
    const result = await this.dataSource.query(
      `SELECT * FROM kdv_profile WHERE phone = ? ORDER BY profile_date DESC LIMIT 1`,
      [phone],
    );

    if (result.length === 0) {
      return {
        status: 'not_found',
        message: `No profile image found for phone ${phone}`,
        data: null,
      };
    }

    // Add full image URL to the result object
  
    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/profile/`;
    const profileData = {
      ...result[0],
      profile_image_url: imageBaseUrl + result[0].profile_image,
      role: role, // optional: include role in response
    };

    return {
      status: 'success',
      message: 'Profile fetched successfully',
      data: profileData,
    };
  } catch (error) {
    console.error('❌ Error fetching profile:', error.message);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to fetch profile',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}



// async getProfiledriver(phone: number): Promise<any> {
//   try {
//     const result = await this.dataSource.query(
//       `SELECT * FROM kdv_dvprofile WHERE driver_phone = ? ORDER BY profile_date DESC LIMIT 1`,
//       [phone],
//     );

//     if (result.length === 0) {
//       return {
//         status: 'not_found',
//         message: `No profile image found for driver_phone ${phone}`,
//         data: null,
//       };
//     }

//     // Add full image URL to the result object
//     const baseUrl = 'http://209.97.172.105:3000/public/images/profile/';
//     const profileData = {
//       ...result[0],
//       profile_image_url: baseUrl + result[0].profile_image,
//     };

//     return {
//       status: 'success',
//       message: 'Profile fetched successfully',
//       data: profileData,
//     };
//   } catch (error) {
//     console.error('❌ Error fetching profile:', error.message);
//     throw new HttpException(
//       {
//         status: 'error',
//         message: 'Failed to fetch profile',
//         error: error.message,
//       },
//       HttpStatus.INTERNAL_SERVER_ERROR,
//     );
//   }
// }


async getProfiledriver(body: { phone: number; role?: string }): Promise<any> {
  const { phone, role } = body;

  try {
    const result = await this.dataSource.query(
      `SELECT * FROM kdv_dvprofile WHERE driver_phone = ? ORDER BY profile_date DESC LIMIT 1`,
      [phone],
    );

    if (result.length === 0) {
      return {
        status: 'not_found',
        message: `No profile image found for driver_phone ${phone}`,
        data: null,
      };
    }

    // Add full image URL to the result object
   
    const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/profile/`;
    const profileData = {
      ...result[0],
      profile_image_url: result[0].profile_image
        ? imageBaseUrl + result[0].profile_image
        : '',
    };

    return {
      status: 'success',
      message: 'Profile fetched successfully',
      data: profileData,
    };
  } catch (error) {
    console.error('❌ Error fetching profile:', error.message);
    throw new HttpException(
      {
        status: 'error',
        message: 'Failed to fetch profile',
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async getParameter(dto: { name: string }): Promise<any> {
  try {
    const query = `SELECT * FROM kd_parameter WHERE parameter = ?`;
    const result = await this.dataSource.query(query, [dto.name]);

    if (result.length === 0) {
      return {
        status: 'not_found',
        message: `Parameter with name '${dto.name}' not found`,
        data: [],
      };
    }

    return {
      status: 'success',
      message: 'Parameter fetched successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error fetching parameter:', error);
    return {
      status: 'error',
      message: 'Failed to fetch parameter info',
      error: error.message,
    };
  }
}

async getAllParameters(): Promise<any> {
  try {
    const query = `SELECT * FROM kd_parameter ORDER BY parameter`;
    const result = await this.dataSource.query(query);

    return {
      status: 'success',
      message: 'All parameters fetched successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error fetching all parameters:', error);
    return {
      status: 'error',
      message: 'Failed to fetch all parameters',
      error: error.message,
    };
  }
}

async updateParameter(dto: { name: string; value: string }): Promise<any> {
  try {
    // Check if parameter exists
    const checkQuery = `SELECT * FROM kd_parameter WHERE parameter = ?`;
    const existingParam = await this.dataSource.query(checkQuery, [dto.name]);

    if (existingParam.length === 0) {
      return {
        status: 'not_found',
        message: `Parameter with name '${dto.name}' not found`,
        data: [],
      };
    }

    // Update the parameter
    const updateQuery = `UPDATE kd_parameter SET setup = ? WHERE parameter = ?`;
    await this.dataSource.query(updateQuery, [dto.value, dto.name]);

    // Return updated parameter
    const updatedResult = await this.dataSource.query(checkQuery, [dto.name]);

    return {
      status: 'success',
      message: 'Parameter updated successfully',
      data: updatedResult,
    };
  } catch (error) {
    console.error('Error updating parameter:', error);
    return {
      status: 'error',
      message: 'Failed to update parameter',
      error: error.message,
    };
  }
}


  async updateUserPassword(phone: string, newPassword: string): Promise<{ status: string; message: string }> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const result = await this.dataSource.query(
        `UPDATE kd_user SET password = ? WHERE phone = ?`,
        [hashedPassword, phone]
      );
      if (result.affectedRows === 0) {
        throw new Error('User not found or no change');
      }
      return {
        status: 'success',
        message: 'Password updated successfully',
      };
    } catch (error) {
      console.error('❌ Error updating password for phone:', phone, '-', error.message);
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
}
