import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { UserEntity } from '../user';

@Entity('role')
export class RoleEntity extends BaseEntity {
  @Column('character varying')
  name: string;

  @Column('int')
  access: number;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
