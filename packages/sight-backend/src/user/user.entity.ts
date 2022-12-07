import { Session } from 'src/auth/auth.entity';
import { Instances } from 'src/instances/instances.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { nullable: true })
  password?: string;

  @Column('integer', { default: 10 })
  role: number;

  @OneToMany(() => Instances, (instances) => instances.user)
  instances?: Instances[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsertAction() {
    console.log(this.password);
    this.password = bcrypt.hashSync(this.password, 8);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdateAction() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 8);
    }
    this.updatedAt = new Date();
  }
}
