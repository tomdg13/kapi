import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { IoGroupService } from 'src/service/iogroup.service';
import {
  CreateIogroupDto,
  UpdateIogroupDto,
  IogroupDto,
  FindGroupByIdDto,
} from 'src/dto/iogroup.dto';

@Controller('iogroup')
export class IoGroupController {
  constructor(private readonly ioGroupService: IoGroupService) {}

  /**
   * GET /api/iogroup/:id
   * Find a specific group by ID
   */
  @Get(':id')
  async findGroupById(@Param('id', ParseIntPipe) id: number) {
    try {
      const dto: FindGroupByIdDto = { id };
      return await this.ioGroupService.findGroupById(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch group',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/iogroup
   * Find groups by status, company_id, or other filters
   * Query params: status, company_id, group_type, search, page, limit
   */
  @Get()
  async findGroupsByStatus(@Query(ValidationPipe) query: IogroupDto) {
    try {
      return await this.ioGroupService.findGroupsByStatus(query);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch groups',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/iogroup
   * Create a new group with auto-generated group_code
   * Required: company_id, group_name
   * Optional: phone, image (base64), user_id
   */
  @Post()
  async createGroup(@Body(ValidationPipe) createGroupDto: CreateIogroupDto) {
    try {
      return await this.ioGroupService.addGroupWithImage(createGroupDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create group',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/iogroup/:id
   * Update an existing group
   * All fields are optional
   */
  @Put(':id')
  async updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateGroupDto: UpdateIogroupDto,
  ) {
    try {
      return await this.ioGroupService.updateGroupWithImage(id, updateGroupDto);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to update group',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE /api/iogroup/:id
   * Delete a group and its associated image
   */
  @Delete(':id')
  async deleteGroup(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ioGroupService.deleteGroup(id);
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to delete group',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}