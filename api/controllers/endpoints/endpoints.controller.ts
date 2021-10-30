import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import App from "../../app";
import authMiddleware from '../../middleware/auth.middleware'
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import {getUserById} from "../../models/user.model";
import {dbQuery} from "../../utils/DB";
import dockerService from '../../services/dockerService'

class EndpointsController extends App implements Controller {
    public path = '/endpoints'
    public router = Router()

    constructor(...props) {
        super(props);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(this.path, authMiddleware)
        this.router.get(this.path, async (req: IRequest, res: IResponse, next: INext) => {
            const user = await getUserById(req.user.id);
            if (user.role === 1) {
                dbQuery('SELECT * FROM endpoints').then(async (endpoints: any[]) => {
                    // @ts-ignore
                    if (endpoints.length > 0) {
                        for (const endpoint of endpoints) {
                            if (endpoint.type === 1 || endpoint.type === 2) {
                                const service = new dockerService()
                                const docker = await service.connect(endpoint.id)
                                console.log(await service.version())
                            }
                        }
                        return res.send('d')
                        // let arr = [];
                        // for (const endpointQ of endpoints) {
                        //     if (endpointQ.type === 1 || endpointQ.type === 2) {
                        //         const service = new dockerService()
                        //         const docker = await service.connect(endpointQ.id)
                        //         // @ts-ignore
                        //         const endpoint = await service.getEndpoint(docker.endpoint, docker.service)
                        //         arr.push(endpoint)
                        //     }
                        // }
                        // return res.send(arr)
                    } else {
                        return res.send([])
                    }
                })
            } else {
                return res.send([])
            }

        })
    }


}

export default EndpointsController