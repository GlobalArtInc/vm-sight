import {
  IsBoolean,
  IsDecimal,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class EndpointsTlsDto {
  @IsBoolean()
  @IsOptional()
  public active: boolean;

  @IsBoolean()
  @IsOptional()
  public ca: boolean;

  @IsBoolean()
  @IsOptional()
  public cert: boolean;

  @IsBoolean()
  @IsOptional()
  public key: boolean;
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
  public data: EndpointsCreateDtoData;

  @IsDecimal()
  @IsString()
  public tempId: number | "socket";
}
