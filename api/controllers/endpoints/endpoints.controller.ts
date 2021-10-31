import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import App from "../../app";
import authMiddleware from '../../middleware/auth.middleware'
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import {getUserById} from "../../models/user.model";
import {dbQuery} from "../../utils/DB";
import dockerService from '../../services/dockerService'
import NotFoundException from "../../exceptions/NotFoundException";
import DockerController from "./docker.controller";

class EndpointsController extends App implements Controller {
    public path = '/endpoints'
    public router = Router()

    constructor(...props) {
        super(props);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(this.path, authMiddleware)
        this.router.use(this.path + '/:endpointId/docker', new DockerController().router)

        this.router.get(this.path, async (req: IRequest, res: IResponse) => {
            const user = await getUserById(req.user.id);
            if (user.role === 1) {
                dbQuery('SELECT * FROM endpoints').then(async (endpoints: any[]) => {
                    if (endpoints.length > 0) {
                        let arr = [];
                        for (const endpoint of endpoints) {
                            if (endpoint.type === 1 || endpoint.type === 2) {
                                const service = new dockerService()
                                await service.connect(endpoint.id)
                                arr.push(await service.getEndpoint())
                            }
                        }
                        return res.send(arr)
                    } else {
                        return res.send([])
                    }
                })
            } else {
                return res.send([])
            }
        })

        this.router.get(this.path + '/:endpointId', async (req: IRequest, res: IResponse, next: INext) => {
            const service = new dockerService()
            await service.connect(req.params.endpointId)
            const endpoint = await service.getEndpoint()
            if (endpoint)
                return res.send(endpoint)
            else
                next(new NotFoundException)
        })

    }


}

export default EndpointsController