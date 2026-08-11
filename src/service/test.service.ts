// adjustment.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  TesttDto,
} from 'src/dto/test.dto';

@Injectable()
export class testService {
  constructor(private dataSource: DataSource) { }
  async find(TesttDto: TesttDto): Promise<any> {
    try {
      const query = `select * from kd_user where user_id='${TesttDto.id}'`;
      // console.log(query);
      const result = await this.dataSource.query(query);
      return {
        status: 'success',
        message: 'select was successfully',
        data: result
      };
    } catch (error) {
      console.error('Error during select data:', error);
      return {
        status: 'error',
        message: 'Failed to select info',
        error: error.message,
      };
    }
  }

}
