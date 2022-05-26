import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export enum EndpointTypes {
  DOCKER = 1,
  DOCKER_SOCKET = 2,
}

export class EndpointsTlsDto {
  @IsBoolean()
  @IsOptional()
  public active = false;

  @IsBoolean()
  @IsOptional()
  public ca = false;

  @IsBoolean()
  @IsOptional()
  public cert = false;

  @IsBoolean()
  @IsOptional()
  public key = false;
}

/**
 * @openapi
 * definitions:
 *   createEndpointDto:
 *     type: object
 *     properties:
 *       tempId:
 *         type: number
 *         description: Temp ID for create the folder to check connection
 *       name:
 *         type: string
 *         default: Name
 *         description: Endpoint name
 *       tls:
 *         type: boolean
 *         default: false
 *       tls_ca:
 *         type: boolean
 *         default: false
 *       tls_cert:
 *         type: boolean
 *         default: false
 *       tls_key:
 *         type: boolean
 *         default: false
 *       type:
 *         type: number
 *         default: 1
 *         description: Endpoint type
 *       host:
 *         type: string
 *         default: Host
 *         description: Endpoint host
 */
export class CreateEndpointsDto {
  @IsNotEmpty()
  public tempId: number | 'socket';

  @IsString()
  public name: string;

  @IsBoolean()
  @IsOptional()
  public tls: number;
  @IsBoolean()
  @IsOptional()
  public tls_ca: number;
  @IsBoolean()
  @IsOptional()
  public tls_cert: number;
  @IsBoolean()
  @IsOptional()
  public tls_key: number;

  @IsEnum(EndpointTypes)
  public type: 1 | 2 | 3 | 4;

  @IsNotEmpty()
  @IsString()
  public host: string;
}

export class UpdateEndpointDto {
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public public_url: string;

  @IsBoolean()
  @IsOptional()
  public tls: number;
  @IsBoolean()
  @IsOptional()
  public tls_ca: number;
  @IsBoolean()
  @IsOptional()
  public tls_cert: number;
  @IsBoolean()
  @IsOptional()
  public tls_key: number;

  @IsString()
  public host: string;
}
