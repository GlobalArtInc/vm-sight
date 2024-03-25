import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthUserDto {
  @ApiProperty({
    example: 'admin@globalart.dev',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
