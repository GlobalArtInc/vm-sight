import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export enum DockerActions {
  start = 'start',
  stop = 'stop',
  kill = 'kill',
  restart = 'restart',
  pause = 'pause',
  resume = 'resume',
  recreate = 'recreate',
  remove = 'remove',
}
export class IPAM {
  @IsString()
  public Driver: string;

  @IsArray()
  public Config: IPAMConfig[];
}

export class IPAMConfig {
  @IsString()
  public Subnet: string;

  @IsString()
  @IsOptional()
  public Gateway: string;

  @IsString()
  @IsOptional()
  public IPRange: string;
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

/**
 * @openapi
 * definitions:
 *   CreateNetworkDto:
 *     type: object
 *     properties:
 *       Attachable:
 *         type: boolean
 *         default: false
 *         required: true
 *       CheckDuplicate:
 *         type: boolean
 *         default: true
 *         required: true
 *       Driver:
 *         type: string
 *         default: bridge
 *         required: true
 *       EnableIPv6:
 *         type: boolean
 *         default: false
 *         required: true
 *       IPAM:
 *         type: object
 *         properties:
 *            Driver:
 *              type: string
 *              default: default
 *              required: true
 *            Config:
 *              type: array
 *              required: false
 *              items:
 *                type: object
 *                properties:
 *                  Subnet:
 *                    type: string
 *                    default: 10.0.0.9
 *                    required: false
 *                  Gateway:
 *                    type: string
 *                    default: 255.255.255.0
 *                    required: false
 *                  IPRange:
 *                    type: string
 *                    default: 10.0.0.9/64
 *                    required: false
 *       Internal:
 *         type: boolean
 *         default: false
 *         required: true
 *       Labels:
 *         type: object
 *       Name:
 *         type: string
 *         default: Network name
 *         required: true
 *       Options:
 *         type: object
 */
export class CreateNetworkDto {
  @IsBoolean()
  public Attachable: boolean;

  @IsBoolean()
  public CheckDuplicate: boolean;

  @IsString()
  public Driver: string;

  @IsBoolean()
  public EnableIPv6: boolean;

  @IsObject()
  public IPAM: IPAM;

  @IsBoolean()
  public Internal: boolean;

  @IsObject()
  public Labels: object;

  @IsString()
  public Name: string;

  @IsObject()
  public Options: object;
}

/**
 * @openapi
 * definitions:
 *   DockerNetworkActionsDto:
 *     type: object
 *     properties:
 *       Container:
 *         type: string
 *         default: null
 *         required: true
 */
export class NetworkActionsDto {
  @IsString()
  @IsNotEmpty()
  public Container: string;
}
