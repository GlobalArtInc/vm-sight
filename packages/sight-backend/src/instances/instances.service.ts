import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DockerService } from 'src/docker/docker.service';
import { Repository } from 'typeorm';
import { Instances, InstancesConfig } from './instances.entity';

@Injectable()
export class InstancesService {
  constructor(
    @InjectRepository(Instances) private readonly instancesRepo: Repository<Instances>,
    @InjectRepository(InstancesConfig) private readonly instancesConfigRepo: Repository<InstancesConfig>,
    private readonly dockerService: DockerService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getEndpoint(endpoint: Instances): Promise<any> {
    const { id, type } = endpoint;
    const instanceConfig = await this.instancesConfigRepo.findOneBy({ instance: { id } });

    if (type === 1 || type === 2) {
      // return this.dockerService.getDockerEndpoint(endpoint, instanceConfig?.config);
    }

    return null;
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
