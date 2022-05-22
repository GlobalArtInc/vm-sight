import Route from "@interfaces/routes.interface";
import {Router} from "express";
import SettingsController from "../controllers/settings.controller";
import UsersService from "../services/users.service";
import UsersController from "../controllers/users.controller";
import {wrapRouteHandler} from "../utils/util";
import validationMiddleware from "../middleware/validation.middleware";
import {CreateAdminDto} from "../dtos/users.dto";
import authMiddleware from "../middleware/auth.middleware";

class UsersRoute implements Route {
    public path = "/users";
    public router = Router();
    public usersController = new UsersController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/admin/check", wrapRouteHandler(this.usersController.usersCheck))
        this.router.post("/admin/init", validationMiddleware(CreateAdminDto, 'body'), wrapRouteHandler(this.usersController.initAdministrator))

        this.router.get('/', authMiddleware, wrapRouteHandler(this.usersController.getUsers))
        this.router.get('/:id', authMiddleware, wrapRouteHandler(this.usersController.getUserById))

    }
}

export default UsersRoute;
