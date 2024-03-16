import { EndpointRepository } from '@app/dal/repositories/endpoint';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEndpointDto } from './dtos';
import { IsolationLevel, Transactional } from 'typeorm-transactional';
import { EndpointsRoute } from './routes';
import { ErrorEnum } from '@app/shared/enums';

@Injectable()
export class EndpointService {
  constructor(
    private readonly endpointRepository: EndpointRepository,
    private readonly endpointsRoute: EndpointsRoute
  ) {}

  async getAllByUserId(userId: number) {
    return this.endpointRepository.getManyBy({
      endpointsUsers: { userId },
    });
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async create(data: CreateEndpointDto, userId: number) {
    const entity = await this.endpointRepository.create({
      ...data,
      endpointsUsers: [{ userId, access: 100 }],
    });

    return entity.id;
  }

  async execute(id: number, data: any) {
    const endpoint = await this.endpointRepository.getOneBy({ id });
    if (!endpoint) {
      throw new NotFoundException(ErrorEnum.ENTITY_NOT_FOUND);
    }

    return this.endpointsRoute.route(endpoint.connectionType).exec(endpoint, data);
  }
}
