import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user';
import { EndpointEntity } from './endpoint.entity';

@Entity('endpoints_users')
export class EndpointUsersEntity {
  @PrimaryColumn('int')
  endpointId: number;

  @PrimaryColumn('int')
  userId: number;

  @Column('int')
  access: number;

  @ManyToOne(() => UserEntity, (user) => user.endpointsUsers)
  user: UserEntity;

  @ManyToOne(() => EndpointEntity, (endpoint) => endpoint.endpointsUsers)
  endpoint: EndpointEntity;
}
