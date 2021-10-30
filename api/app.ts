import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import Controller from "./interfaces/controller.interface";
import DebugLogger from "./utils/DebugLogger";
import errorMiddleware from './middleware/error.middleware';
global.data = "./data"
export const port = 3601

const key = fs.readFileSync(`${global.data}/vm-sight.pem`)

export default class App {
    public app: express.Application;
    public log;

    constructor(controllers: Controller[]) {
        this.app = express()
        this.log = DebugLogger
        this.app.set('jwt-secret', key)

        this.initializeMiddlewares()
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(port, () => {
            this.log.info(`App listening on the port ${port}`)
        });
    }

    public getServer() {
        return this.app
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

}