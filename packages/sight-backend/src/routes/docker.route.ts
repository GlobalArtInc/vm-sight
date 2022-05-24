import Route from '@interfaces/routes.interface';
import DockerService from '@services/docker.service';
import { Router } from 'express';

class DockerRoute implements Route {
  public path = '/';
  public router = Router();
  public dockerService = new DockerService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/networks', async (req, res) => {
      return res.send(req.params);
      // await this.dockerService.connect(req.params['endpointId']);
      // console.log(this.dockerService.getEndpoint());
      // return res.send([]);
    });
  }
}

export default DockerRoute;
