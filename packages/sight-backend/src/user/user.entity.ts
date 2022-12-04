import { Session } from 'src/auth/auth.entity';
import { Instances } from 'src/instances/instances.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { nullable: true })
  password: string;

  @Column('integer', { default: 10 })
  role: number;

  @OneToMany(() => Instances, (instances) => instances.user)
  instances: Instances[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
