import App from "../../app";
import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import dockerService from "../../services/dockerService";
import HttpException from "../../exceptions/HttpException";
import NotFoundException from "../../exceptions/NotFoundException";

class DockerController extends App implements Controller {
    public path = '/docker'
    public router = Router({mergeParams: true})

    constructor(...props) {
        super(props);
        this.initializeRoutes()
    }

    private initializeRoutes() {
        require('express-ws')(this.router);
        // @ts-ignore
        this.router.ws('/:containerId/attach', async (ws, req) => {
            const {endpointId, containerId} = req.params

            try {
                const service = new dockerService()
                await service.connect(endpointId)
                const container = await service.getContainer(containerId)
                container.attach({
                    stream: true,
                    stdout: true,
                    stderr: true
                }, function handler(err, stream) {
                    stream.on('data', (chunk) => {
                        if (ws.readyState === 1) {
                            ws.send(chunk.toString())
                        }
                    })
                })
            } catch (err) {
                return ws.send({status: 400, message: 'No connection'})
            }
        })
        this.router.get('/:containerId/attach', (req: IRequest, res: IResponse, next: INext) => {
            return next(new HttpException(403, "Only websocket connections"))
        })
        this.router.get('/networks', async (req: IRequest, res: IResponse, next: INext) => {
            const {endpointId} = req.params
            try {
                const service = new dockerService()
                await service.connect(endpointId)
                return res.send(await service.listNetworks())
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/networks/:networkId/connect', async (req: IRequest, res: IResponse, next: INext) => {
            const {endpointId, networkId} = req.params
            const {Container} = req.body

            try {
                const service = new dockerService()
                await service.connect(endpointId)
                const network = await service.getNetwork(networkId)
                if (network && await network.connect({Container, Force: true})) {
                    return res.send({response: true})
                } else {
                    next(new NotFoundException)
                }
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/networks/:networkId/disconnect', async (req: IRequest, res: IResponse, next: INext) => {
            const {endpointId, networkId} = req.params
            const {Container} = req.body

            try {
                const service = new dockerService()
                await service.connect(endpointId)
                const network = await service.getNetwork(networkId)
                if (network && await network.disconnect({Container, Force: true})) {
                    return res.send({response: true})
                } else {
                    next(new NotFoundException)
                }
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.get('/info', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                return res.send(await service.info())
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.get('/version', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                return res.send(await service.version())
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.get('/images', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                return res.send(await service.getImages())
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
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
                next(new HttpException(err.statusCode, err.message))
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
                next(new HttpException(err.statusCode, err.message))
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
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.get('/containers/:containerId/logs', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                const container = await service.getContainer(req.params.containerId)
                if (container) {
                    return res.send(await container.logs(req.query))
                } else {
                    next(new NotFoundException)
                }
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/containers/:containerId/start', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.startContainer(req.params.containerId)
                return res.send({status: 200, message: "The container has been started"})
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/containers/:containerId/stop', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.stopContainer(req.params.containerId)
                return res.send({status: 200, message: "The container has been stopped"})
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/containers/:containerId/kill', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.killContainer(req.params.containerId)
                return res.send({status: 200, message: "The container has been killed"})
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/containers/:containerId/restart', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.restartContainer(req.params.containerId)
                return res.send({status: 200, message: "The container has been restarted"})
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
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
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/containers/:containerId/resume', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                await service.resumeContainer(req.params.containerId)
                return res.send({status: 200, message: "The container has been resumed"})
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/containers/:containerId/rename', async (req: IRequest, res: IResponse, next: INext) => {
            const {endpointId, containerId} = req.params
            const {name} = req.query

            try {
                const service = new dockerService()
                await service.connect(endpointId)
                await service.renameContainer(containerId, name)
                return res.send({status: 200, message: "The container has been renamed"})
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

        this.router.post('/containers/:containerId/update', async (req: IRequest, res: IResponse, next: INext) => {
            const {endpointId, containerId} = req.params

            try {
                const service = new dockerService()
                await service.connect(endpointId)
                const container = await service.getContainer(containerId)
                await container.update(req.body)
                return res.send({status: 200, message: "The container has been updated"})
            } catch (err) {
                return next(new HttpException(500, err))
            }
        })

        this.router.post('/containers/:containerId/exec', async (req: IRequest, res: IResponse, next: INext) => {
            try {
                const {endpointId, containerId} = req.params
                const service = new dockerService()
                await service.connect(endpointId)
                const container = await service.getContainer(containerId)
                if (container) {
                    const exec = await container.exec({Cmd: ['bash'], AttachStdin: true, AttachStdout: true})
                    return res.send({Id: exec.id})
                } else {
                    next(new NotFoundException)
                }
            } catch (err) {
                next(new HttpException(err.statusCode, err.message))
            }
        })

    }

}

export default DockerController