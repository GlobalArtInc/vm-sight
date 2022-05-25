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
