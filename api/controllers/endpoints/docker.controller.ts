import App from "../../app";
import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import dockerService from "../../services/dockerService";
import HttpException from "../../exceptions/HttpException";
import NotFoundException from "../../exceptions/NotFoundException";

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
            try {
                const service = new dockerService()
                await service.connect(endpointId)
                return res.send(await service.listNetworks())
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.get('/info', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                return res.send(await service.info())
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.get('/version', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                return res.send(await service.version())
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.get('/containers', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                const containers = await service.getContainers()
                let arr = []
                containers.forEach((container) => {
                    arr.push({
                        Id: container.Id,
                        Name: container.Names[0].substr(1),
                        Image: container.Image,
                        ImageID: container.ImageID,
                        Command: container.Command,
                        Created: container.Created,
                        Ports: container.Ports,
                        Labels: container.Labels,
                        State: container.State,
                        Status: container.Status,
                        HostConfig: container.HostConfig,
                        NetworkSettings: container.NetworkSettings,
                        Mounts: container.Mounts
                    })
                })
                return res.send(arr)
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.get('/containers/:containerId', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                const container = await service.getContainer(req.params.containerId)
                if (container) {
                    return res.send(await container.inspect())
                } else {
                    next(new NotFoundException)
                }
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.delete('/containers/:containerId', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                const container = await service.getContainer(req.params.containerId)
                if (container) {
                    return res.send(await container.remove({force: true, v: 1}))
                } else {
                    next(new NotFoundException)
                }
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })


        this.router.post('/containers/:containerId/start', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.startContainer(req.params.containerId)
                return res.send({response: true})
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.post('/containers/:containerId/stop', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.stopContainer(req.params.containerId)
                return res.send({response: true})
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.post('/containers/:containerId/kill', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.killContainer(req.params.containerId)
                return res.send({response: true})
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.post('/containers/:containerId/restart', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.restartContainer(req.params.containerId)
                return res.send({response: true})
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.post('/containers/:containerId/pause', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.pauseContainer(req.params.containerId)
                return res.send({response: true})
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

        this.router.post('/containers/:containerId/resume', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.resumeContainer(req.params.containerId)
                return res.send({response: true})
            } catch (err) {
                next(new HttpException(err.statusCode, err.json))
            }
        })

    }

}

export default DockerController