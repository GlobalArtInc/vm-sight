import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthUserDto {
  @ApiProperty({
    example: 'admin@globalart.dev',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'admin',
  })
  @IsString()
  password: string;
}
