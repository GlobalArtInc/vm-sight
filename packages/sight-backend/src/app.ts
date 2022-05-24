import express from 'express';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { logger } from '@utils/logger';
import { errorMiddleware } from '@middlewares';
import { IRequest, IResponse } from '@interfaces/routes.interface';
import { port, environment, dataDir } from './constants';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import DB from './databases';
import helmet from 'helmet';
import hpp from 'hpp';
import { generateKeyPairSync } from 'crypto';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor() {
    this.app = express();
    this.port = port ?? 3700;
    this.env = environment ?? 'dev';
  }

  public async init(routes) {
    logger.info(`=================================`);
    logger.info(`checkingKeys...`);
    this.generateKeys();
    logger.info(`connectToDatabase...`);
    await this.connectToDatabase();
    logger.info(`initializeMiddlewares...`);
    await this.initializeMiddlewares();
    logger.info(`initializeRoutes...`);
    await this.initializeRoutes(routes);
    logger.info('initializingSwagger...');
    await this.initializeSwagger();
    logger.info(`initializeErrorHandling...`);
    await this.initializeErrorHandling();
  }

  public generateKeys() {
    const key = `${dataDir}/vm-sight.pem`;
    const pub = `${dataDir}/vm-sight.pub`;

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    if (!fs.existsSync(key)) {
      fs.appendFileSync(key, privateKey);
    }
    if (!fs.existsSync(pub)) {
      fs.appendFileSync(pub, publicKey);
    }
  }

  public async connectToDatabase() {
    await DB.sequelize.authenticate();
  }

  private async initializeRoutes(routes) {
    routes.forEach(route => {
      this.app.use([`/api${route.path}`, route.path], route.router);
    });

    // TO DO: Public folder for uploaded thumbnails
    // this.app.use(express.static(path.join(__dirname, '../../frontend/build')));
  }

  public listen() {
    require('express-ws')(this.app);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    process.on('uncaughtException', function (err) {
      console.log(err);
      // this.log.error(err)
    });

    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  // public getServer() {
  //     return this.app
  // }

  private initializeMiddlewares() {
    // if (this.env === "production") {
    //     this.app.use(morgan('combined', {stream}));
    // } else {
    //     this.app.use(morgan('dev', {stream}));
    // }
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());

    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'VmSightAPI',
        },
      },
      apis: ['swagger.yaml', './src/controllers/**/*.ts'],
    };
    const specs = swaggerJSDoc(options);
    this.app.use(['/docs', '/api/docs'], swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
    this.app.use('*', (req: IRequest, res: IResponse) => {
      return res.status(404).send({ status: 404, message: 'Not Found' });
    });
  }
}

export default App;
