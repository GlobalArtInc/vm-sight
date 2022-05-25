import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class AuthUserDto {
  @IsString()
  @IsOptional()
  public Username?: string;

  @IsString()
  @IsOptional()
  public Password?: string;

  @IsString()
  @IsOptional()
  public Code?: string;
}

export class CreateUserDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsNumber()
  public role: number;
}

export class UpdateUserDto {
  @IsString()
  public username: string;

  @IsString()
  @IsOptional()
  public password: string;

  @IsNumber()
  public role: number;
}

export class CreateAdminDto {
  @IsString()
  @Length(4, 25)
  public Username: string;

  @IsString()
  @Length(8)
  public Password: string;
}
