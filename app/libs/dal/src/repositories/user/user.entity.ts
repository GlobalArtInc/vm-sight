import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { RoleEntity } from '../role';
import { SessionEntity } from '../session/session.entity';
import { EndpointEntity } from '../endpoint';
import { EndpointUsersEntity } from '../endpoint/endpoint-users.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column('character varying', { unique: true })
  username: string;

  @Column('character varying')
  password: string;

  @ManyToMany(() => RoleEntity, (role) => role.users, {
    cascade: true,
  })
  @JoinTable()
  roles: RoleEntity[];

  @OneToMany(() => EndpointUsersEntity, (endpointUsers) => endpointUsers.user, {
    cascade: true,
  })
  endpointsUsers: EndpointUsersEntity[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];
}
