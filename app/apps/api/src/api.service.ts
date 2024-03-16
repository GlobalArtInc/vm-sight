import { RoleRepository } from '@app/dal/repositories/role';
import { RoleAccessEnum } from '@app/shared/enums/role.enum';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ApiService implements OnModuleInit {
  constructor(private readonly roleRepository: RoleRepository) {}

  async onModuleInit() {
    Logger.log('Init app');
    await this.init();
    Logger.log('Init app completed');
  }

  private async init() {
    await this.checkAndCreateCoreAdminRole();
  }

  private async checkAndCreateCoreAdminRole() {
    const isCoreRole = await this.roleRepository.getOneBy({ access: RoleAccessEnum.CORE_ADMIN });
    if (!isCoreRole) {
      Logger.log('Create core admin role');
      await this.roleRepository.create({ name: 'Core Admin', access: RoleAccessEnum.CORE_ADMIN });
    } else {
      Logger.log('Skip create core admin role, already exists');
    }
  }
}
