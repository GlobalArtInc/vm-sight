import Route from '@interfaces/routes.interface';
import { Router } from 'express';
import { wrapRouteHandler } from '@utils/util';
import EndpointsController from '@controllers/endpoints.controller';
import { authMiddleware, validationMiddleware } from '@middlewares';
import { CreateEndpointsDto, UpdateEndpointDto } from '@dtos/endpoints.dto';
import DockerRoute from './docker.route';

class EndpointsRoute implements Route {
  public path = '/endpoints';
  public router = Router();
  public endpointsController = new EndpointsController();

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

    this.router.use('/:endpointId/docker', new DockerRoute().router);

    // this.router.get("/:endpointId/docker/networks", async (req, res) => {
    //   res.send([]);
    // });
  }
}

export default EndpointsRoute;
