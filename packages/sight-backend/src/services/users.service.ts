import { UsersModel } from '../models';
import { CreateAdminDto, CreateUserDto, UpdateUserDto, UserLanguages } from '@dtos/users.dto';
import { cryptPassword, generateID } from '@utils/security';
import { Op } from 'sequelize';
import { HttpException, NotFoundException, BadRequestException, ConflictException } from '../exceptions';
import { currentTimestamp } from '@utils/util';

class UsersService {
  public async checkAdmin() {
    const user = await UsersModel.findAll({ where: { role: 1 } });

    if (user.length > 0) {
      return { response: true };
    } else {
      throw new HttpException(400, 'No administrator account found in the database');
    }
  }

  public async initAdmin(createAdminDto: CreateAdminDto) {
    const user = await UsersModel.findAll({ where: { role: 1 } });
    if (user.length === 0) {
      if (createAdminDto.username && createAdminDto.password) {
        const hash = await cryptPassword(createAdminDto.password);
        await new UsersModel({
          id: generateID(),
          username: createAdminDto.username,
          password: hash,
          role: 1,
        }).save();
        return { status: 201 };
      } else {
        throw new BadRequestException('No username or password');
      }
    } else {
      throw new ConflictException('Admin is already exists');
    }
  }

  public async changeLanguage(userId: string, language: UserLanguages) {
    const user = await UsersModel.findOne({ where: { id: userId } });
    if (user) {
      await user.update({ locale: language });
      return true;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  public async getAll() {
    return UsersModel.findAll({
      attributes: ['id', 'username', 'role', 'locale', 'createdAt', 'updatedAt'],
    });
  }

  public async getById(id: string) {
    return UsersModel.findOne({
      where: { id },
      attributes: ['id', 'username', 'role', 'locale', 'createdAt', 'updatedAt'],
    });
  }

  public async create(userData: CreateUserDto) {
    const user = await UsersModel.create({ ...userData });
    await user.save();
    return { userId: user.id };
  }

  public async update(id: string, userData: UpdateUserDto) {
    const user = await this.getById(id);
    if (user) {
      const isUser = await UsersModel.findOne({
        where: {
          username: userData.username,
          id: {
            [Op.ne]: user.id,
          },
        },
      });
      if (isUser) throw new ConflictException('username is already exists');

      if (userData.password) {
        userData.password = await cryptPassword(userData.password);
      }

      await user.update(userData);
      return { status: 200 };
    } else {
      throw new NotFoundException('User not found');
    }
  }

  public async remove(id: string) {
    const user = await this.getById(id);
    if (user) {
      await user.destroy();
      return { status: 200 };
    } else {
      throw new NotFoundException('User not found');
    }
  }
}

export default UsersService;
