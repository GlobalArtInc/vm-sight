import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { UserEntity } from '../user';
import { EndpointUsersEntity } from './endpoint-users.entity';
import { EndpointTypeEnum } from '@app/shared/enums/endpoint.enums';
import { DockerConnectionParamsLocal, DockerConnectionParamsRemote } from '@app/shared/types/docker.types';

@Entity('endpoint')
export class EndpointEntity extends BaseEntity {
  @Column('character varying')
  name: string;

  @Column('character varying')
  connectionType: EndpointTypeEnum;

  @Column('jsonb', { default: {} })
  connectionInfo: DockerConnectionParamsLocal | DockerConnectionParamsRemote;

  @OneToMany(() => EndpointUsersEntity, (endpointUsers) => endpointUsers.endpoint, {
    cascade: true,
  })
  @JoinTable()
  endpointsUsers: EndpointUsersEntity[];
}
