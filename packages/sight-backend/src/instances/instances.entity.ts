import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Instances {
  @PrimaryGeneratedColumn()
  id: number;

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
