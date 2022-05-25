import Route from '@interfaces/routes.interface';
import { Router } from 'express';
import SettingsController from '../controllers/settings.controller';
import { wrapRouteHandler } from '@utils/util';

class SettingsRoute implements Route {
  public path = '/settings';
  public router = Router();
  public settingsController = new SettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/public', wrapRouteHandler(this.settingsController.public));
  }
}

export default SettingsRoute;
