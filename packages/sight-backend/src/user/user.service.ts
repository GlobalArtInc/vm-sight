import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, InitAdminDto, UpdateUserDto } from './common/user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './common/user.enums';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async getOneBy(findData: any): Promise<User> {
    const user = await this.userRepo.findOneBy(findData);
    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const newUser = this.userRepo.create(dto);
    await this.userRepo.save(newUser);

    return newUser.id;
  }

  async deleteUser(callerUser: User, id: number) {
    const user = await this.getOneBy({ id });
    if (user.id === callerUser.id) {
      throw new ForbiddenException('you_cant_delete_yourself');
    }
    if (user.role === UserRole.Admin) {
      throw new ForbiddenException('you_cant_delete_admin');
    }
    await this.userRepo.delete({ id });
  }

  async createAdminUser(email: string, password: string, role: number) {
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
    await this.createAdminUser(username, password, 100);
  }

  async getUsers() {
    return this.userRepo.find({ select: ['id', 'email', 'role', 'createdAt', 'updatedAt'] });
  }

  async getUserById(id: number) {
    return this.userRepo.findOne({ select: ['id', 'email', 'role', 'createdAt', 'updatedAt'], where: { id } });
  }

  async updateUserById(id: number, dto: UpdateUserDto) {
    const { email, role, password } = dto;
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    if (password) {
      await this.userRepo.update({ id }, { password: bcrypt.hashSync(password, 8) });
    }

    await this.userRepo.update({ id }, { email, role });
  }
}
