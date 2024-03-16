import { DockerContainersActions, DockerFunctions, DockerImagesActions } from '@app/shared/types/docker.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class EndpointExecuteDto {
  @ApiProperty({ example: 'info' })
  @IsString()
  func: any;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  action?: any;

  @ApiPropertyOptional({
    example: { id: 1 },
  })
  @IsOptional()
  @IsObject()
  params?: Record<string, unknown>;
}
