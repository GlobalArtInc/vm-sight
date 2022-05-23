import Route from "@interfaces/routes.interface";
import { Router } from "express";
import { wrapRouteHandler } from "@utils/util";
import EndpointsController from "@controllers/endpoints.controller";
import authMiddleware from "@middlewares/auth.middleware";

class EndpointsRoute implements Route {
  public path = "/endpoints";
  public router = Router();
  public endpointsController = new EndpointsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/",
      authMiddleware,
      wrapRouteHandler(this.endpointsController.getAll)
    );
    this.router.post(
      "/",
      authMiddleware,
      wrapRouteHandler(this.endpointsController.createEndpoint)
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      wrapRouteHandler(this.endpointsController.remove)
    );
  }
}

export default EndpointsRoute;
