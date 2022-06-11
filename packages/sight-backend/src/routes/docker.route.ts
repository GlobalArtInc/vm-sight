import Route from '@interfaces/routes.interface';
import { Router } from 'express';
import { authMiddleware, validationMiddleware } from '@middlewares';
import { wrapRouteHandler } from '@utils/util';
import DockerController from '@controllers/docker.controller';
import { CreateNetworkDto, DockerActionsDto } from '@dtos/docker.dto';

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
    this.router.patch(
      '/containers/:containerId',
      authMiddleware,
      validationMiddleware(DockerActionsDto, 'body'),
      wrapRouteHandler(this.dockerController.containerAction),
    );
    this.router.get('/containers/:containerId/logs', authMiddleware, wrapRouteHandler(this.dockerController.getContainerLogs));
    this.router.put('/containers/:containerId', authMiddleware, wrapRouteHandler(this.dockerController.updateContainer));
    this.router.delete('/containers/:containerId', authMiddleware, wrapRouteHandler(this.dockerController.removeContainer));

    this.router.get('/volumes', authMiddleware, wrapRouteHandler(this.dockerController.getVolumes));
    this.router.post('/volumes', authMiddleware, wrapRouteHandler(this.dockerController.createVolume));
    this.router.get('/volumes/:volumeId', authMiddleware, wrapRouteHandler(this.dockerController.getVolumeById));
    this.router.delete('/volumes/:volumeId', authMiddleware, wrapRouteHandler(this.dockerController.deleteVolumeById));

    this.router.get('/networks', authMiddleware, wrapRouteHandler(this.dockerController.getNetworks));
    this.router.post(
      '/networks',
      authMiddleware,
      validationMiddleware(CreateNetworkDto, 'body'),
      wrapRouteHandler(this.dockerController.createNetwork),
    );
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
