import { EndpointEntity, EndpointRepository } from '@app/dal/repositories/endpoint';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEndpointDto } from './dtos';
import { IsolationLevel, Transactional } from 'typeorm-transactional';
import { EndpointsRoute } from './routes';
import { ErrorEnum } from '@app/shared/enums';
import { from, lastValueFrom, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { GetDataWithFilterDto } from '@app/shared/dtos';

@Injectable()
export class EndpointService {
  constructor(
    private readonly endpointRepository: EndpointRepository,
    private readonly endpointsRoute: EndpointsRoute
  ) {}

  async getAllByUserId(userId: number, data: GetDataWithFilterDto<EndpointEntity>) {
    const { limit, offset, orderBy, sortBy } = data;
    const response = await this.endpointRepository.getWithLimitAndOffset(
      {
        endpointsUsers: { userId },
      },
      limit,
      offset,
      sortBy,
      orderBy,
    )
    const serviceMap = await this.createServiceMap(response.data);

    return {
      data: response.data.map((endpoint) => ({
        ...endpoint,
        isActive: serviceMap.has(endpoint.id),
        serviceInfo: serviceMap.get(endpoint.id),
      })),
      recordsTotal: response.totalCount,
      recordsFiltered: response.data.length,
      limit: response.limit,
    };
  }

  async getOneById(id: number) {
    const endpoint = await this.endpointRepository.getOneBy({ id });
    if (!endpoint) {
      throw new NotFoundException(ErrorEnum.ENTITY_NOT_FOUND);
    }
    const serviceMap = await this.createServiceMap([endpoint]);

    return {
      ...endpoint,
      isActive: serviceMap.has(endpoint.id),
      serviceInfo: serviceMap.get(endpoint.id),
    };
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

  async createServiceMap(endpoints: EndpointEntity[]) {
    return lastValueFrom(
      from(endpoints).pipe(
        mergeMap(async (endpoint) => [
          endpoint.id,
          await this.endpointsRoute.route(endpoint.connectionType).connectAndGetInfo(endpoint),
        ]),
        toArray(),
        map((results) => new Map<number, string[]>(results as [number, string[]][]))
      )
    );
  }
}
