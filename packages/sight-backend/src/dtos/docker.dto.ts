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

/**
 * @openapi
 * definitions:
 *   dockerActionsDto:
 *     type: object
 *     properties:
 *       action:
 *         type: string
 *         enum:
 *           - start
 *           - stop
 *           - kill
 *           - restart
 *           - pause
 *           - resume
 *           - recreate
 *         required: true
 */
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
