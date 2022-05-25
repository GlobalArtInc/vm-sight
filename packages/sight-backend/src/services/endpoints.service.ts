import { EndpointsModel } from '@models/index';
import { NotFoundException } from '@exceptions/index';
import { CreateEndpointsDto, UpdateEndpointDto } from '@dtos/endpoints.dto';
import { DockerService } from '@services/docker.service';

class EndpointsService {
  public dockerService = new DockerService();

  public async getAll() {
    const arr = [];
    const endpoints = await EndpointsModel.findAll();
    for (const item of endpoints) {
      if (item.type === 1 || item.type === 2) {
        const docker = new DockerService();
        await docker.connect(item.id);
        arr.push(await docker.getEndpoint());
      }
    }
    return arr;
  }

  public async getOne(id: string) {
    const docker = new DockerService();
    const endpoint = await EndpointsModel.findOne({ where: { id } });
    if (!endpoint) throw new NotFoundException('The endpoint was not found');
    await docker.connect(endpoint.id);
    return docker.getEndpoint();
  }

  public async create(endpointData: CreateEndpointsDto) {
    if (endpointData.type === 1 || endpointData.type === 2) {
      await this.dockerService.checkConnect(endpointData, true);
      await new EndpointsModel({ ...endpointData }).save();
    }
    return true;
    //await new EndpointsModel(endpointData).save();
  }

  public async update(id: string, endpointData: UpdateEndpointDto) {
    await this.dockerService.checkConnect(endpointData);
    const endpoint = await EndpointsModel.findOne({ where: { id } });
    await endpoint.update(endpointData);
    return true;
  }

  public async remove(id: string) {
    const endpoint = await EndpointsModel.findOne({ where: { id } });
    if (endpoint) {
      await endpoint.destroy();
      return true;
    } else {
      throw new NotFoundException('Endpoint not found');
    }
  }
}

export default EndpointsService;
