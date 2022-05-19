import App from "../../app";
import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import dockerService from "../../services/dockerService";
import HttpException from "../../exceptions/HttpException";
import NotFoundException from "../../exceptions/NotFoundException";
import * as fs from "fs";

class WebSocketController extends App implements Controller {
    public path = '/websocket'
    public router = Router({mergeParams: true})

    constructor(...props) {
        super(props);
        this.initializeRoutes()
    }

    private initializeRoutes() {
        require('express-ws')(this.router);

        // @ts-ignore
        this.router.ws('/attach', async (ws, req) => {
            const {endpointId, id} = req.query

            try {
                const service = new dockerService()
                await service.connect(endpointId)
                const container = await service.getContainer(id)
                container.attach({
                    stream: true,
                    stdout: true,
                    stderr: true
                }, function handler(err, stream) {
                    stream.on('data', (chunk) => {
                        if (ws.readyState === 1) {
                            ws.send(chunk.toString().slice(8) + '\t')
                        }
                    })
                })
            } catch (err) {
                return ws.send({status: 400, message: 'No connection'})
            }
        })

        // @ts-ignore
        this.router.ws('/exec', async (ws, req) => {
            const {endpointId, id} = req.query

            try {
                const service = new dockerService()
                await service.connect(endpointId)
                await service.interactiveShell("287697b60fc9a34c17f3027212c46cc2275f52cd2c26c68a082ccaa72db8174c")

              // await service.connect(endpointId)
              // const container = await service.getContainer(id)
              // container.exec(id, (err, stream) => {
              //     console.log(stream)
              // })
                // container.attach({
               //     stream: true,
               //     stdout: true,
               //     stderr: true
               // }, function handler(err, stream) {
               //     stream.on('data', (chunk) => {
               //         if (ws.readyState === 1) {
               //             ws.send(chunk.toString().slice(8) + '\t')
               //         }
               //     })
               // })
            } catch (err) {
                return ws.send({status: 400, message: 'No connection'})
            }

        })

        this.router.get('*', (req: IRequest, res: IResponse, next: INext) => {
            return next(new HttpException(403, "Only websocket connections"))
        })
    }
}

export default WebSocketController