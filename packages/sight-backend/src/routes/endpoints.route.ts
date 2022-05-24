import Route from '@interfaces/routes.interface';
import { Router } from 'express';
import { wrapRouteHandler } from '@utils/util';
import EndpointsController from '@controllers/endpoints.controller';
import { authMiddleware, validationMiddleware } from '@middlewares';
import { CreateEndpointsDto, UpdateEndpointDto } from '@dtos/endpoints.dto';
import DockerRoute from './docker.route';
import DockerController from '@controllers/docker.controller';

class EndpointsRoute implements Route {
  public path = '/endpoints';
  public router = Router();
  public endpointsController = new EndpointsController();
  public dockerController = new DockerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', authMiddleware, wrapRouteHandler(this.endpointsController.getAll));
    this.router.post(
      '/',
      authMiddleware,
      validationMiddleware(CreateEndpointsDto, 'body'),
      wrapRouteHandler(this.endpointsController.createEndpoint),
    );
    this.router.get('/:id', authMiddleware, wrapRouteHandler(this.endpointsController.getEndpointById));
    this.router.put('/:id', authMiddleware, validationMiddleware(UpdateEndpointDto, 'body'), wrapRouteHandler(this.endpointsController.update));
    this.router.delete('/:id', authMiddleware, wrapRouteHandler(this.endpointsController.remove));

    // DOCKER
    this.router.get('/:endpointId/docker/containers', authMiddleware, wrapRouteHandler(this.dockerController.getContainers));
    this.router.get('/:endpointId/docker/containers/:containerId', authMiddleware, wrapRouteHandler(this.dockerController.getContainerById));
    this.router.post('/:endpointId/docker/containers/:containerId/start', authMiddleware, wrapRouteHandler(this.dockerController.startContainer));
    this.router.post('/:endpointId/docker/containers/:containerId/stop', authMiddleware, wrapRouteHandler(this.dockerController.stopContainer));
    this.router.post('/:endpointId/docker/containers/:containerId/kill', authMiddleware, wrapRouteHandler(this.dockerController.killContainer));
    this.router.post('/:endpointId/docker/containers/:containerId/restart', authMiddleware, wrapRouteHandler(this.dockerController.restartContainer));
    this.router.post('/:endpointId/docker/containers/:containerId/pause', authMiddleware, wrapRouteHandler(this.dockerController.pauseContainer));
    this.router.post('/:endpointId/docker/containers/:containerId/resume', authMiddleware, wrapRouteHandler(this.dockerController.resumeContainer));
    this.router.delete('/:endpointId/docker/containers/:containerId', authMiddleware, wrapRouteHandler(this.dockerController.removeContainer));

    this.router.get('/:endpointId/docker/networks', authMiddleware, wrapRouteHandler(this.dockerController.getNetworks));
    this.router.get('/:endpointId/docker/networks/:networkId', authMiddleware, wrapRouteHandler(this.dockerController.getNetworkById));
    this.router.delete('/:endpointId/docker/networks/:networkId', authMiddleware, wrapRouteHandler(this.dockerController.deleteNetworkById));
  }
}

export default EndpointsRoute;
