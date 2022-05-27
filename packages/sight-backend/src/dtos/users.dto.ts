import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export enum UserLanguages {
  ru = 'ru',
  en = 'en',
  uk = 'uk',
}

/**
 * @openapi
 * definitions:
 *   AuthUserDto:
 *     type: object
 *     required:
 *       - Username
 *       - Password
 *     properties:
 *       Username:
 *         type: string
 *         description: user login
 *       Password:
 *         type: string
 *         description: user Password
 */
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

/**
 * @openapi
 * definitions:
 *   changeUserLanguageDto:
 *     type: object
 *     properties:
 *       language:
 *         type: string
 *         required: true
 *         default: en
 */
export class ChangeUserLanguageDto {
  @IsEnum(UserLanguages, { message: 'Wrong language' })
  @IsNotEmpty({ message: 'Language is not specified' })
  public language: string;
}

/**
 * @openapi
 * definitions:
 *   createUserDto:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *         description: User name
 *       password:
 *         type: string
 *         description: User password
 *       role:
 *         type: integer
 *         description: User role
 */
export class CreateUserDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsNumber()
  public role: number;
}

/**
 * @openapi
 * definitions:
 *   updateUserDto:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *         description: User name
 *       password:
 *         type: string
 *         description: User password
 *       role:
 *         type: integer
 *         description: User role
 */
export class UpdateUserDto {
  @IsString()
  public username: string;

  @IsString()
  @IsOptional()
  public password: string;

  @IsNumber()
  public role: number;
}

/**
 * @openapi
 * definitions:
 *   CreateAdminDto:
 *     type: object
 *     properties:
 *       Username:
 *         type: string
 *         description: User name
 *       Password:
 *         type: string
 *         description: User password
 */
export class CreateAdminDto {
  @IsString()
  @Length(4, 25)
  public Username: string;

  @IsString()
  @Length(8)
  public Password: string;
}
