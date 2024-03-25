import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { RoleEntity } from '../role';
import { SessionEntity } from '../session/session.entity';
import { EndpointEntity } from '../endpoint';
import { EndpointUsersEntity } from '../endpoint/endpoint-users.entity';
import * as crypto from 'crypto';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column('character varying', { unique: true })
  email: string;

  @Column('character varying')
  password: string;

  @ManyToMany(() => RoleEntity, (role) => role.users, {
    cascade: true,
  })
  @JoinTable()
  roles: RoleEntity[];

  get avatar() {
    const avatarHash = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${avatarHash}`;
  }

  @OneToMany(() => EndpointUsersEntity, (endpointUsers) => endpointUsers.user, {
    cascade: true,
  })
  endpointsUsers: EndpointUsersEntity[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];
}
