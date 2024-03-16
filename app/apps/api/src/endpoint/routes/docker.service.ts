import { EndpointEntity } from '@app/dal/repositories/endpoint';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EndpointExecuteDto } from '../dtos';
import { ErrorEnum } from '@app/shared/enums';
import {
  DockerConnectionParamsRemote,
  DockerConnectionParamsLocal,
  DockerContainersActions,
  DockerImagesActions,
  DockerFunctions,
} from '@app/shared/types/docker.types';
import * as Docker from 'dockerode';

@Injectable()
export class DockerService {
  protected socket: Docker;

  private async connect(endpoint: EndpointEntity) {
    this.socket = new Docker(endpoint.connectionInfo);
  }

  async exec(endpoint: EndpointEntity, data: EndpointExecuteDto) {
    const { func, action, params } = data;

    const executionFunctionsMap: Record<DockerFunctions, any> = {
      info: () => this.info(),
      config: () => this.config(),
      checkConnection: () => this.checkConnection(endpoint.connectionInfo),
      containers: () => this.containers(action, params),
      images: () => this.images(action, params),
    }
    await this.connect(endpoint);

    const executionFunction = executionFunctionsMap[func as DockerFunctions];
    if (executionFunction) {
      return executionFunction();
    } else {
      throw new NotFoundException(ErrorEnum.UNKNOWN_ACTION);
    }
  }

  private async info() {
    return this.socket.info();
  }

  private async config() {
    return this.socket.listConfigs();
  }

  private async checkConnection(connectionInfo: DockerConnectionParamsRemote | DockerConnectionParamsLocal) {
    const dockerMessage = await this.socket.checkAuth(connectionInfo);

    return dockerMessage.Status === 'Login Succeeded';
  }

  async containers(action: DockerContainersActions, params: Record<string, unknown>) {
    const actionsMap: Record<DockerContainersActions, any> = {
      list: () => this.socket.listContainers({ all: true, ...params }),
      create: () => this.socket.createContainer({ ...params }),
      inspect: () => this.socket.getContainer(params.id as string).inspect(),
      logs: () => this.socket.getContainer(params.id as string).logs({ stderr: true, stdout: true, ...params }),
      kill: () => this.socket.getContainer(params.id as string).kill({ force: true, ...params }),
      start: () => this.socket.getContainer(params.id as string).start({ ...params }),
      stop: () => this.socket.getContainer(params.id as string).stop({ ...params }),
      restart: () => this.socket.getContainer(params.id as string).restart({ ...params }),
      remove: () => this.socket.getContainer(params.id as string).remove({ ...params }),
      update: () => this.socket.getContainer(params.id as string).update({ ...params }),
      rename: () => this.socket.getContainer(params.id as string).rename({ ...params }),
      pause: () => this.socket.getContainer(params.id as string).pause({ ...params }),
      unpause: () => this.socket.getContainer(params.id as string).unpause({ ...params }),
      attach: () => this.socket.getContainer(params.id as string).attach({ ...params }),
    };

    const actionFunction = actionsMap[action];
    if (actionFunction) {
      return actionFunction();
    } else {
      throw new NotFoundException(ErrorEnum.UNKNOWN_ACTION);
    }
  }

  async images(action: DockerImagesActions, params: Record<string, unknown>) {
    const actionsMap: Record<DockerImagesActions, any> = {
      list: () => this.socket.listImages({ all: true, ...params }),
      create: () => this.socket.createImage({ ...params }),
      inspect: () => this.socket.getImage(params.id as string).inspect(),
      remove: () => this.socket.getImage(params.id as string).remove(),
      build: () => this.socket.buildImage(params.file as string, params),
      delete: () => this.socket.getImage(params.id as string).remove({ ...params }),
      history: () => this.socket.getImage(params.id as string).history(),
      push: () => this.socket.getImage(params.id as string).push({ ...params }),
      tag: () => this.socket.getImage(params.id as string).tag(),
      search: () => this.socket.searchImages({ ...params }),
      deleteUnused: () => this.socket.pruneImages({ ...params }),
      import: () => this.socket.importImage(params.file as string, params)
    };

    const actionFunction = actionsMap[action];
    if (actionFunction) {
      return actionFunction();
    } else {
      throw new NotFoundException(ErrorEnum.UNKNOWN_ACTION);
    }
  }
}
