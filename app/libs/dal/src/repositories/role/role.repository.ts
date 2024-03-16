import { RoleAccessEnum } from '@app/shared/enums/role.enum';
import { BaseRepository } from '../base-repository';
import { RoleEntity } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>
  ) {
    super(repository.target, repository.manager);
  }

  async getCoreAdmin() {
    return this.repository.findOne({ where: { access: RoleAccessEnum.CORE_ADMIN } });
  }

  async createMap() {
    const roles = await this.repository.find();

    return new Map(roles.map((role) => [role.id, role]));
  }
}
