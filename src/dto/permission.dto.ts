import { IsOptional, IsString, IsBoolean, IsNumber, IsIn, IsNotEmpty, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PermissionDto {
  @IsNumber()
  permission_id: number;

  @IsString()
  module_name: string;

  @IsString()
  module_code: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class RolePermissionDto {
  @IsNumber()
  @Type(() => Number)
  permission_id: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 1 || value === 'true')
  can_read?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 1 || value === 'true')
  can_write?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 1 || value === 'true')
  can_approve?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 1 || value === 'true')
  can_delete?: boolean;

  @IsOptional()
  @IsIn(['none', 'read_only', 'write_only', 'read_write', 'approve_read', 'full_access'])
  access_level?: string;
}

export class UpdateRolePermissionsDto {
  @IsArray()
  permissions: RolePermissionDto[];
}

export class CheckPermissionDto {
  @IsNotEmpty()
  @IsString()
  module_code: string;

  @IsNotEmpty()
  @IsIn(['read', 'write', 'approve', 'delete'])
  action: string;
}

export class AccessLevelDto {
  @IsNumber()
  @Type(() => Number)
  permission_id: number;

  @IsNotEmpty()
  @IsIn(['none', 'read_only', 'write_only', 'read_write', 'approve_read', 'full_access'])
  access_level: string;
}

export class BulkAccessLevelDto {
  @IsArray()
  access_levels: AccessLevelDto[];
}