import { BaseRepository } from '../base-repository';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {
    super(repository.target, repository.manager);
  }

  async cryptPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(passwordHash: string, password: string) {
    return bcrypt.compareSync(password, passwordHash);
  }
}
