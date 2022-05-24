import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

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

export class EndpointsCreateDtoData {
  @IsString()
  public name: string;

  @IsObject()
  @IsOptional()
  tls: EndpointsTlsDto;

  @IsNumber()
  public type: number;

  @IsString()
  public url: string;
}

export class CreateEndpointsDto {
  @IsObject()
  public data: EndpointsCreateDtoData;

  @IsNotEmpty()
  public tempId: number | 'socket';
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
