import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as fs from 'fs';
import Controller from "./interfaces/controller.interface";
import DebugLogger from "./utils/DebugLogger";
import errorMiddleware from './middleware/error.middleware';
import {IRequest, IResponse} from "./interfaces/express.interface";
import Init from "./utils/Init";
import {port, environment, dataDir} from "./constants";

export default class App {
    public app: express.Application;
    public log;

    constructor(controllers: Controller[]) {
        this.app = express()
        this.log = DebugLogger
        if (environment === 'prod') {
            this.app.use("/", express.static(path.join(__dirname, './dist')));
        }

        this.initializeMiddlewares()
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        require('express-ws')(this.app);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }
        process.on('uncaughtException', function (err) {
            console.log(err)
            // this.log.error(err)
        });

        this.app.listen(port, async () => {
            await new Init().start()
            this.log.info(`Api server listening on the port ${port}`)
        });
    }

    // public getServer() {
    //     return this.app
    // }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
        this.app.use("*", (req: IRequest, res: IResponse) => {
            return res.status(404).send({status: 404, message: "Not Found"})
        })
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/api' + controller.path , controller.router);
        });
    }

}
