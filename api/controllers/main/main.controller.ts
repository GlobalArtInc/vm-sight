import {Router} from 'express';
import {IRequest, IResponse} from '../../interfaces/express.interface';
import Controller from '../../interfaces/controller.interface';
import authMiddleware from '../../middleware/auth.middleware';
import App from '../../app';
import SettingsController from './settings.controller';

class MainController extends App implements Controller {
    public path = '/'
    public router = Router()

    constructor(...props) {
        super(props)
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use('/me', authMiddleware)
        this.router.use('/settings', new SettingsController().router)
        this.router.get('/motd', (req: IRequest, res: IResponse) => {
            return res.json({
                response: true
            })
        })

        this.router.get('/me', (req: IRequest, res: IResponse) => {
            return res.status(200).send({
                id: req.user.id,
                username: req.user.username,
                role: req.user.role,
                createdAt: req.user.createdAt,
                updatedAt: req.user.updatedAt
            })
        })

        this.router.get('/version', (req: IRequest, res: IResponse) => {
            return res.send({Version: "1.0"})
        })

    }

}

export default MainController