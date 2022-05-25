import { IsBoolean, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export enum EndpointTypes {
  SUCCESS = 0,
  ERROR = 1,
  RUNNING = 2,
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

  @IsObject()
  @IsOptional()
  tls: EndpointsTlsDto;

  @IsEnum(EndpointTypes)
  public type: 1 | 2 | 3 | 4;

  @IsString()
  @IsNotEmpty()
  public host: string;
}

export class UpdateEndpointDto {
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public public_url: string;

  @IsObject()
  @IsOptional()
  public tls: EndpointsTlsDto;

  @IsString()
  public url: string;
}
