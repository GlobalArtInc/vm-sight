import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Instances {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: '1' })
  type: number;

  @Column('int')
  userId: number;

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
