import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getOneBy(findData: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOneBy(findData);
    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    return user;
  }
}
