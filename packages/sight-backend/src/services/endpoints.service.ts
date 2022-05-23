import { EndpointsModel } from "../models";
import NotFoundException from "../exceptions/NotFoundException";
import { CreateEndpointsDto } from "@dtos/endpoints.dto";

class EndpointsService {
  public dockerService;

  public async getAll() {
    const arr = [];
    const endpoints = await EndpointsModel.findAll();
    for (const item of endpoints) {
      arr.push({
        Id: item.id,
        Name: item.name,
        Type: item.type,
        tls: item.tls,
      });
    }
    return arr;
  }

  public async getOne(id: string) {
    return EndpointsModel.findOne({ where: { id } });
  }

  public async create(endpointData: CreateEndpointsDto) {
    if (endpointData.data.type === 1) {
      if (endpointData.tempId === "socket") {
      } else {
      }
    }
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
