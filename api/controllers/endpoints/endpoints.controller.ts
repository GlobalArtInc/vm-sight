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
import ForbiddenException from "../../exceptions/ForbiddenException";
import HttpException from "../../exceptions/HttpException";
import {getGUID} from "../../utils/Security";

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

        this.router.post(this.path + '/list', async (req: IRequest, res: IResponse, next: INext) => {
            const user = await getUserById(req.user.id);
            if (user.role === 1) {
                const {name, url, type} = req.body.data
                const d = req.body.type

                if (!name) {
                    return next(new HttpException(405, "Endpoint name is not specified"))
                }

                if (d === '' || d === null) {
                    if (!url) {
                        return next(new HttpException(405, "URL is not specified"))
                    }
                }
                const id = getGUID()

                if (type === 1) {
                    if (d === 'socket') {
                        dbQuery("SELECT * FROM endpoints WHERE url LIKE '%/var/run/docker.sock%'").then((e: any[]) => {
                            if (e.length > 0) {
                                return res.status(403).send({message: "endpoint_already_exists"})
                            } else {
                                const service = new dockerService()

                                service.checkConnect(null, '/var/run/docker.sock').then(() => {
                                    dbQuery(`INSERT INTO endpoints (id,name,type,url)VALUES('${id}','${name}','2', '/var/run/docker.sock')`).then(() => {
                                        return res.send({response: true})
                                    }).catch((err) => {
                                        next(new HttpException(500, err))
                                    })
                                }).catch(() => {
                                    return res.status(500).send({message: "Failed to connect to the server"})
                                })
                            }
                        })
                    } else {

                    }
                }

            } else {
                next(new ForbiddenException)
            }
        })

    }


}

export default EndpointsController