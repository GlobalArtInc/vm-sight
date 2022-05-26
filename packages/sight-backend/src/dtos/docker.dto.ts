import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export enum DockerActions {
  start = 'start',
  stop = 'stop',
  kill = 'kill',
  restart = 'restart',
  pause = 'pause',
  resume = 'resume',
  recreate = 'recreate',
}

export class DockerActionsDto {
  @IsEnum(DockerActions, {
    message: `Wrong action`,
  })
  @IsNotEmpty()
  public action: string;

  @IsObject()
  @IsOptional()
  public params: object;
}
