import Route from '@interfaces/routes.interface';
import { Router } from 'express';
import UsersController from '../controllers/users.controller';
import { wrapRouteHandler } from '@utils/util';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateAdminDto, UpdateUserDto } from '@dtos/users.dto';
import authMiddleware from '@middlewares/auth.middleware';

class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/admin/check', wrapRouteHandler(this.usersController.usersCheck));
    this.router.post('/admin/init', validationMiddleware(CreateAdminDto, 'body'), wrapRouteHandler(this.usersController.initAdministrator));

    this.router.get('/', authMiddleware, wrapRouteHandler(this.usersController.getUsers));
    this.router.post('/', authMiddleware, wrapRouteHandler(this.usersController.createUser));
    this.router.get('/:id', authMiddleware, wrapRouteHandler(this.usersController.getUserById));
    this.router.put('/:id', authMiddleware, validationMiddleware(UpdateUserDto, 'body'), wrapRouteHandler(this.usersController.update));
    this.router.delete('/:id', authMiddleware, wrapRouteHandler(this.usersController.remove));
  }
}

export default UsersRoute;
