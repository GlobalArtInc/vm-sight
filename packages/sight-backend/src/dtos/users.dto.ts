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
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *         example: admin
 *         description: user login
 *       password:
 *         type: string
 *         example: admin
 *         description: user password
 */
export class AuthUserDto {
  @IsString()
  @IsOptional()
  public username?: string;

  @IsString()
  @IsOptional()
  public password?: string;

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
 *         example: ru
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
 *       username:
 *         type: string
 *         description: User name
 *       password:
 *         type: string
 *         description: User password
 */
export class CreateAdminDto {
  @IsString()
  @Length(4, 25)
  public username: string;

  @IsString()
  @Length(8)
  public password: string;
}
