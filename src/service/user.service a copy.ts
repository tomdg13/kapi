// user.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserDto } from 'src/dto/user.dto'; // Consider renaming to FindUserDto for clarity
import { VillageIdDto } from 'src/auth/dto/village-id.dto';

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

      return {
        status: 'success',
        message: dto.role.toLowerCase() === 'admin' ? 'All users fetched' : `Users with role ${dto.role} fetched`,
        data: result,
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




  async findAllBanks(): Promise<any> {
    try {
      const query = `SELECT * FROM kd_bank`;
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
      const result = await this.dataSource.query('SELECT * FROM kd_province');
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
        'SELECT * FROM kd_district WHERE pr_id = ?',
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
      )`;
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

}
