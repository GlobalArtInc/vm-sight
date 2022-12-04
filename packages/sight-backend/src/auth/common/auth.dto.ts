import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ type: String, default: 'admin' })
  email: string;

  @ApiProperty({ type: String, default: 'admin' })
  password: string;
}
