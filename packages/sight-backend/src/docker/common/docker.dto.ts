import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DockerContainerActions } from './docker.enum';

export class executeContainerActionDto {
  @ApiProperty({ type: 'enum', enum: DockerContainerActions, example: DockerContainerActions.Start })
  @IsEnum(DockerContainerActions)
  action: DockerContainerActions;
}
