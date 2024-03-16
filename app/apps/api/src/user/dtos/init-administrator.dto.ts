import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class InitAdministratorDto {
  @ApiProperty({ type: String, example: 'admin@globalart.dev' })
  @IsEmail()
  username: string;

  @ApiProperty({ type: String, example: 'admin' })
  @IsString()
  password: string;
}
