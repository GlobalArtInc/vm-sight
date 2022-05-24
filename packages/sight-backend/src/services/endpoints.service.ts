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
    await docker.connect((await EndpointsModel.findOne({ where: { id } })).id);
    return docker.getEndpoint();
  }

  public async checkConnect(endpointData) {
    if (endpointData.tempId === 'socket') {
      await this.dockerService.checkConnect('socket', '/var/run/docker.sock', endpointData?.data?.tls ?? endpointData.tls);
    } else {
      await this.dockerService.checkConnect(
        endpointData.tempId,
        endpointData?.data?.url ?? endpointData.url,
        endpointData?.data?.tls ?? endpointData.tls,
      );
    }
    return true;
  }

  public async create(endpointData: CreateEndpointsDto) {
    const tls = endpointData.data.tls.active,
      tls_ca = endpointData.data.tls.ca,
      tls_cert = endpointData.data.tls.cert,
      tls_key = endpointData.data.tls.key;

    await this.dockerService.checkConnect(endpointData.tempId, endpointData.data.url, endpointData.data.tls);

    if (endpointData.tempId === 'socket') {
      endpointData.data.url = '/var/run/docker.sock';
    }

    await new EndpointsModel({
      ...endpointData.data,
      tls,
      tls_ca,
      tls_cert,
      tls_key,
    }).save();
  }

  public async update(id: string, endpointData: UpdateEndpointDto) {
    await this.dockerService.checkConnect(id, endpointData.url, endpointData.tls);
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
