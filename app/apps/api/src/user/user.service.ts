import { UserRepository } from '@app/dal/repositories';
import { RoleAccessEnum } from '@app/shared/enums/role.enum';
import { ConflictException, Injectable } from '@nestjs/common';
import { InitAdministratorDto } from './dtos';
import { RoleRepository } from '@app/dal/repositories/role';
import { omit } from 'lodash';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) {}

  async isAdministratorPresent() {
    return this.userRepository.getOneAndCheckIfExistsBy({
      roles: {
        access: RoleAccessEnum.CORE_ADMIN,
      },
    });
  }

  async initAdministrator(data: InitAdministratorDto) {
    const [isAdministratorPresent, coreAdminRole] = await Promise.all([
      this.isAdministratorPresent(),
      this.roleRepository.getCoreAdmin(),
    ]);
    if (isAdministratorPresent) {
      throw new ConflictException('administratorAlreadyExists');
    }
    const cryptedPassword = await this.userRepository.cryptPassword(data.password);

    await this.userRepository.create({
      email: data.email,
      password: cryptedPassword,
      roles: [coreAdminRole],
    });
  }

  async getById(id: number) {
    const user = await this.userRepository.getOneBy({ id }, { relations: ['roles'] });

    return {
      ...omit(user, ['password']),
      avatar: user.avatar,
    };
  }
}
