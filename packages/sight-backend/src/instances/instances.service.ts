import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DockerService } from 'src/docker/docker.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateDockerEndpointDto } from './common/instances.dto';
import { EndpointType } from './common/instances.enums';
import { Instances, InstancesConfig } from './instances.entity';

@Injectable()
export class InstancesService {
  constructor(
    @InjectRepository(Instances) private readonly instancesRepo: Repository<Instances>,
    @InjectRepository(InstancesConfig) private readonly instancesConfigRepo: Repository<InstancesConfig>,
    private readonly dockerService: DockerService,
  ) {}

  async getById(id: string): Promise<Instances> {
    return this.instancesRepo.findOneBy({ id });
  }

  async getConfigById(id: string) {
    const model = await this.instancesConfigRepo.findOneBy({ instance: { id } });
    if (model) {
      return model.config;
    }

    return null;
  }

  async checkConnection(type: EndpointType, config: string, _tempId = 0) {
    switch (type) {
      case EndpointType.DockerHttp:
        await this.dockerService.checkConnection(type, config);
        break;
      case EndpointType.DockerSocket:
        await this.dockerService.checkConnection(type, config);
        break;
      case EndpointType.Kubernetes:
        break;
      case EndpointType.Agent:
        break;
    }
  }

  async createEndpoint(callerUser: Partial<User>, dto: CreateDockerEndpointDto) {
    const { name, type, tempId, config } = dto;

    // If dockerSocket
    if (type === EndpointType.DockerSocket) {
      const instances = await this.instancesRepo.find();
      if (instances.length >= 1) {
        throw new ConflictException('more_then_one_instance');
      }
    }
    await this.checkConnection(type, config);

    const newInstance = this.instancesRepo.create({ name, type, user: { id: callerUser.id } });
    await this.instancesRepo.save(newInstance);

    const newConfig = this.instancesConfigRepo.create({
      config: JSON.stringify(config),
      instance: { id: newInstance.id },
    });
    await this.instancesConfigRepo.save(newConfig);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getEndpoint(endpoint: Instances): Promise<any> {
    const { id, type } = endpoint;
    const instanceConfig = await this.instancesConfigRepo.findOneBy({ instance: { id } });

    if (type === 1 || type === 2) {
      return this.dockerService.getDockerEndpoint(endpoint, instanceConfig?.config);
    }

    return null;
  }

  async getEndpointById(id: string) {
    const endpoint = await this.instancesRepo.findOneBy({ id });
    if (!endpoint) {
      throw new NotFoundException('endpoint_not_found');
    }

    return this.getEndpoint(endpoint);
  }

  async getEndpoints(userId: number) {
    const instances = await this.instancesRepo.find({
      where: { user: { id: userId } },
    });
    const arr: unknown[] = [];
    for (const instance of instances) {
      arr.push(this.getEndpoint(instance));
    }

    return Promise.all(arr);
  }
}
