import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './common/auth.dto';
import { Response } from 'express';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Session) private sessionRepo: Repository<Session>, private userService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getOneBy({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }

    return false;
  }

  async createSession(userId: number) {
    const uid = v4();
    const newUser = this.sessionRepo.create({ uid, user: { id: userId } });
    await this.sessionRepo.save(newUser);

    return newUser.uid;
  }

  logout(uid: string, res: Response) {
    if (!uid) {
      throw new NotFoundException('session_not_found');
    }
    res.clearCookie('uid');
  }

  async authServiceByCreds(dto: LoginUserDto, res: Response) {
    const { username, password } = dto;
    const user = await this.validateUser(username, password);
    if (user) {
      const uid = await this.createSession(user.id);
      res.cookie('uid', uid);
    } else {
      throw new ForbiddenException('incorrect_email_or_password');
    }
  }
}
