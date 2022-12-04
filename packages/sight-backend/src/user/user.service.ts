import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InitAdminDto } from './common/user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async getOneBy(findData: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOneBy(findData);
    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    return user;
  }

  async createUser(email: string, password: string, role: number) {
    const newUser = this.userRepo.create({ email, password: bcrypt.hashSync(password, 8), role });
    await this.userRepo.save(newUser);

    return newUser.id;
  }

  async checkAdmin() {
    const users = await this.userRepo.findBy({ role: 100 });

    if (users.length === 0) {
      throw new NotFoundException('No administrator account found inside the database');
    }
  }

  async initAdmin(dto: InitAdminDto) {
    const users = await this.userRepo.findBy({ role: 100 });
    const { username, password } = dto;
    if (users.length > 0) {
      throw new NotFoundException('Administrator account is already exists');
    }
    await this.createUser(username, password, 100);
  }
}
