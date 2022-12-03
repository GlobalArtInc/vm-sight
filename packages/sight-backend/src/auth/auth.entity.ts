import { User } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryColumn('varchar')
  uid: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
