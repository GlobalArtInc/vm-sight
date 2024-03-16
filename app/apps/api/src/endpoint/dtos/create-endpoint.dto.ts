import { EndpointTypeEnum } from '@app/shared/enums/endpoint.enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsString } from 'class-validator';

export class CreateEndpointDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: EndpointTypeEnum, example: EndpointTypeEnum.REMOTE_DOCKER })
  @IsEnum(EndpointTypeEnum)
  connectionType: EndpointTypeEnum;

  @ApiProperty()
  @IsObject()
  connectionInfo: Record<string, unknown>;
}
