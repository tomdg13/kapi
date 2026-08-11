import {
  Controller, Get, Post, Put, Body, Param, Query,
  ParseIntPipe, HttpException, HttpStatus, ValidationPipe, 
  UsePipes, UseGuards, Req,
} from '@nestjs/common';
import { PermissionService } from '../service/permission.service';
import { UpdateRolePermissionsDto, BulkAccessLevelDto, CheckPermissionDto } from '../dto/permission.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { PermissionGuard } from '../auth/permission.guard';
// import { RequirePermission } from '../decorators/permission.decorator';

@Controller('permissions')
// @UseGuards(JwtAuthGuard) // Uncomment if using authentication
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Get all available permissions
  @Get()
  async getPermissions() {
    return await this.permissionService.getPermissions();
  }

  // Get permissions for a specific role
  @Get('role/:roleId')
  async getRolePermissions(@Param('roleId', ParseIntPipe) roleId: number) {
    return await this.permissionService.getRolePermissions(roleId);
  }

  // Update role permissions
  @Put('role/:roleId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // @RequirePermission('role_management', 'write')
  async updateRolePermissions(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    return await this.permissionService.updateRolePermissions(roleId, dto);
  }

  // Quick update access levels
  @Put('role/:roleId/access-levels')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // @RequirePermission('role_management', 'write')
  async updateAccessLevels(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() dto: BulkAccessLevelDto,
  ) {
    return await this.permissionService.updateAccessLevels(roleId, dto);
  }

  // Check user permission
  @Post('check')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async checkPermission(
    @Body() dto: CheckPermissionDto,
    @Req() req: any, // Get user from request
  ) {
    const userId = req.user?.id || 1; // Get from JWT token
    const hasPermission = await this.permissionService.checkUserPermission(
      userId,
      dto.module_code,
      dto.action,
    );

    return {
      status: 'success',
      data: {
        has_permission: hasPermission,
        module_code: dto.module_code,
        action: dto.action,
      },
    };
  }

  // Get current user permissions
  @Get('my-permissions')
  async getMyPermissions(@Req() req: any) {
    const userId = req.user?.id || 1; // Get from JWT token
    return await this.permissionService.getUserPermissions(userId);
  }
}