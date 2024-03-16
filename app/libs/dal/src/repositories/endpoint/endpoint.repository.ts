import { BaseRepository } from '../base-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EndpointEntity } from './endpoint.entity';

export class EndpointRepository extends BaseRepository<EndpointEntity> {
  constructor(
    @InjectRepository(EndpointEntity)
    private readonly repository: Repository<EndpointEntity>
  ) {
    super(repository.target, repository.manager);
  }
}
