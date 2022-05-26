import Route from '@interfaces/routes.interface';
import { Router } from 'express';
import IndexController from '@controllers/index.controller';
import { authMiddleware, validationMiddleware } from '@middlewares';
import { wrapRouteHandler } from '@utils/util';
import { ChangeUserLanguageDto } from '@dtos/users.dto';

class IndexRoute implements Route {
  public path = '/';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/version', wrapRouteHandler(this.indexController.getVersion));
    this.router.get('/me', authMiddleware, wrapRouteHandler(this.indexController.me));
    this.router.get('/motd', wrapRouteHandler(this.indexController.motd));
    this.router.put('/language', authMiddleware, validationMiddleware(ChangeUserLanguageDto), wrapRouteHandler(this.indexController.setLanguage));
  }
}

export default IndexRoute;
