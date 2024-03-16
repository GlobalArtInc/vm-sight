import { BaseRepository } from '../base-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './session.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user';
import * as crypto from 'crypto';

export class SessionRepository extends BaseRepository<SessionEntity> {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>
  ) {
    super(repository.target, repository.manager);
  }

  async generate(user: UserEntity) {
    return this.create({
      uid: crypto.randomBytes(16).toString('hex'),
      userId: user.id,
    });
  }
}
