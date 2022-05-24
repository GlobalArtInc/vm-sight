import Route from '@interfaces/routes.interface';
import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { wrapRouteHandler } from '@utils/util';
import validationMiddleware from '@middlewares/validation.middleware';
import { AuthUserDto } from '@dtos/users.dto';

class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/`, validationMiddleware(AuthUserDto, 'body'), wrapRouteHandler(this.authController.login));
  }
}

export default AuthRoute;
