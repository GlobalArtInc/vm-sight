import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { UserEntity } from '../user';

@Entity('session')
export class SessionEntity extends BaseEntity {
  @Column('character varying', { unique: true })
  uid: string;

  @Column('int')
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity;
}
