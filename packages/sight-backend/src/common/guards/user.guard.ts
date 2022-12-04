import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/auth/auth.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const uid = request.cookies['uid'];
    if (!uid) {
      throw new UnauthorizedException('not_authorized');
    }
    const session = await this.sessionRepo.findOne({ where: { uid }, relations: ['user'] });
    const user = await this.userRepo.findOneBy({ id: session?.user?.id });
    if (!user || !session) {
      throw new UnauthorizedException('not_authorized');
    }
    request.user = user;

    return true;
  }
}
