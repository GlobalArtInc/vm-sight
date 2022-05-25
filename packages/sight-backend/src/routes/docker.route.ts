import Route from '@interfaces/routes.interface';
import { Router } from 'express';
import { authMiddleware } from '@middlewares';
import { wrapRouteHandler } from '@utils/util';
import DockerController from '@controllers/docker.controller';

class DockerRoute implements Route {
  public path = '/docker';
  public router = Router({ mergeParams: true });
  public dockerController = new DockerController();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter() {
    this.router.get('/containers', authMiddleware, wrapRouteHandler(this.dockerController.getContainers));
    this.router.get('/containers/:containerId', authMiddleware, wrapRouteHandler(this.dockerController.getContainerById));
    this.router.get('/containers/:containerId/logs', authMiddleware, wrapRouteHandler(this.dockerController.getContainerLogs));
    this.router.post('/containers/:containerId/update', authMiddleware, wrapRouteHandler(this.dockerController.updateContainer));

    this.router.post('/containers/:containerId/start', authMiddleware, wrapRouteHandler(this.dockerController.startContainer));
    this.router.post('/containers/:containerId/stop', authMiddleware, wrapRouteHandler(this.dockerController.stopContainer));
    this.router.post('/containers/:containerId/kill', authMiddleware, wrapRouteHandler(this.dockerController.killContainer));
    this.router.post('/containers/:containerId/restart', authMiddleware, wrapRouteHandler(this.dockerController.restartContainer));
    this.router.post('/containers/:containerId/pause', authMiddleware, wrapRouteHandler(this.dockerController.pauseContainer));
    this.router.post('/containers/:containerId/resume', authMiddleware, wrapRouteHandler(this.dockerController.resumeContainer));
    this.router.delete('/containers/:containerId', authMiddleware, wrapRouteHandler(this.dockerController.removeContainer));

    this.router.get('/networks', authMiddleware, wrapRouteHandler(this.dockerController.getNetworks));
    this.router.get('/networks/:networkId', authMiddleware, wrapRouteHandler(this.dockerController.getNetworkById));
    this.router.delete('/networks/:networkId', authMiddleware, wrapRouteHandler(this.dockerController.deleteNetworkById));
    this.router.post('/networks/:networkId/connect', authMiddleware, wrapRouteHandler(this.dockerController.connectNetwork));
    this.router.post('/networks/:networkId/disconnect', authMiddleware, wrapRouteHandler(this.dockerController.disconnectNetwork));

    this.router.get('/images', authMiddleware, wrapRouteHandler(this.dockerController.getImages));
    this.router.get('/images/:imageId', authMiddleware, wrapRouteHandler(this.dockerController.getImageById));
    this.router.get('/images/:imageId/history', authMiddleware, wrapRouteHandler(this.dockerController.getImageHistoryById));
    this.router.delete('/images/:imageId', authMiddleware, wrapRouteHandler(this.dockerController.removeImageById));
  }
}

export default DockerRoute;
