import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class Instances {
  @PrimaryColumn()
  id: string;

  @Column('int', { default: '1' })
  type: number;

  @ManyToOne(() => User, (user) => user.instances)
  user: User[];

  @Column('int', { nullable: true })
  teamId: number;

  @Column('varchar')
  name: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsertAction() {
    this.id = v4();
  }
}

@Entity()
export class InstancesConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Instances, (instance: Instances) => instance.id)
  @JoinColumn()
  instance: Instances;

  @Column('text', { default: '{}' })
  config: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
