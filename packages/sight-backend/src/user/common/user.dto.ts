import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class InitAdminDto {
  @ApiProperty({ type: String, example: 'admin' })
  @IsEmail()
  username: string;

  @ApiProperty({ type: String, example: 'admin' })
  @IsString()
  password: string;
}
