import Route from "@interfaces/routes.interface";
import {Router} from "express";
import IndexController from "../controllers/index.controller";
import authMiddleware from "../middleware/auth.middleware";
import {wrapRouteHandler} from "../utils/util";
import indexController from "../controllers/index.controller";

class IndexRoute implements Route {
    public path = "/";
    public router = Router();
    public indexController = new IndexController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/version', wrapRouteHandler(this.indexController.getVersion));
        this.router.get('/me', authMiddleware, wrapRouteHandler(this.indexController.me))
    }

}

export default IndexRoute;
