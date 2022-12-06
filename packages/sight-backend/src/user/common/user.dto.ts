import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { UserRole } from './user.enums';

export class InitAdminDto {
  @ApiProperty({ type: String, example: 'admin' })
  @IsEmail()
  username: string;

  @ApiProperty({ type: String, example: 'admin' })
  @IsString()
  password: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'admin@globalart.dev' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Min(6)
  password: string;

  @ApiProperty({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'admin@globalart.dev' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ type: 'enum', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
