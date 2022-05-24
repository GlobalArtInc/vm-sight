import Route from '@interfaces/routes.interface';
import { Router } from 'express';

class DockerRoute implements Route {
  public path = '/endpoints';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/networks', async (req, res) => {
      return res.send([]);
    });
  }
}

export default DockerRoute;
