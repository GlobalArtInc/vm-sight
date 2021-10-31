import App from "../../app";
import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import dockerService from "../../services/dockerService";
import HttpException from "../../exceptions/HttpException";

class DockerController extends App implements Controller {
    public path = '/docker'
    public router = Router()

    constructor(...props) {
        super(props);
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/networks', async (req: IRequest, res: IResponse, next: INext) => {
            const {endpointId} = req.params
            const service = new dockerService()
            await service.connect(endpointId)
            try {
                return res.send(await service.listNetworks())
            } catch (err) {
                next(new HttpException(err.status, err.message))
            }
        })
    }

}

export default DockerController