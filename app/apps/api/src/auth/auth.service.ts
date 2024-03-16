import { UserRepository } from '@app/dal/repositories';
import { SessionRepository } from '@app/dal/repositories/session';
import { ErrorEnum } from '@app/shared/enums';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthUserDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private readonly sessionRepository: SessionRepository, private readonly userRepository: UserRepository) {}

  async info(sessionId: string) {
    const session = await this.sessionRepository.getOneBy({ uid: sessionId }, { relations: ['user'] });

    if (!session) {
      throw new NotFoundException(ErrorEnum.SESSION_NOT_FOUND);
    }

    return {
      sessionId: session.uid,
      userId: session.userId,
      user: session.user,
    };
  }

  async login(data: AuthUserDto) {
    const { username, password } = data;
    const user = await this.userRepository.getOneBy({ username });
    const isPasswordValidated = await this.userRepository.validatePassword(user?.password, password);

    if (!isPasswordValidated) {
      throw new NotFoundException(ErrorEnum.ENTITY_NOT_FOUND);
    }

    return this.sessionRepository.generate(user);
  }
}
