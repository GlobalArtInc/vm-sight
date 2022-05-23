import { EndpointsModel } from "@models/index";
import { NotFoundException } from "@exceptions/index";
import { CreateEndpointsDto, UpdateEndpointDto } from "@dtos/endpoints.dto";
import { DockerService } from "@services/docker.service";

class EndpointsService {
  private dockerService = new DockerService();

  public async getAll() {
    const arr = [];
    const endpoints = await EndpointsModel.findAll();
    for (const item of endpoints) {
      arr.push({
        id: item.id,
        name: item.name,
        type: item.type,
        tls: item.tls,
      });
    }
    return arr;
  }

  public async getOne(id: string) {
    return EndpointsModel.findOne({ where: { id } });
  }

  public async checkConnect(endpointData) {
    if (endpointData.tempId === "socket") {
      await this.dockerService.checkConnect(
        "/var/run/docker.sock",
        endpointData?.data?.tls ?? endpointData.tls
      );
    } else {
      await this.dockerService.checkConnect(
        endpointData?.data?.url ?? endpointData.url,
        endpointData?.data?.tls ?? endpointData.tls
      );
    }
    return true;
  }

  public async create(endpointData: CreateEndpointsDto) {
    const tls = endpointData.data.tls.active,
      tls_ca = endpointData.data.tls.ca,
      tls_cert = endpointData.data.tls.cert,
      tls_key = endpointData.data.tls.key;

    await this.dockerService.checkConnect(
      endpointData.data.url,
      endpointData.data.tls
    );

    await new EndpointsModel({
      ...endpointData.data,
      tls,
      tls_ca,
      tls_cert,
      tls_key,
    }).save();
  }

  public async update(id: string, endpointData: UpdateEndpointDto) {
    await this.dockerService.checkConnect(endpointData.url, endpointData.tls);
    const endpoint = await this.getOne(id);
    await endpoint.update(endpointData);
    return true;
  }

  public async remove(id: string) {
    const endpoint = await this.getOne(id);
    if (endpoint) {
      await endpoint.destroy();
      return true;
    } else {
      throw new NotFoundException("Endpoint not found");
    }
  }
}

export default EndpointsService;
