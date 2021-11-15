import App from "../../app";
import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import dockerService from "../../services/dockerService";
import HttpException from "../../exceptions/HttpException";
import NotFoundException from "../../exceptions/NotFoundException";
import * as fs from "fs";
import authMiddleware from "../../middleware/auth.middleware"
import TlsUploadController from './tls.controller'

class UploadController extends App implements Controller {
    public path = '/upload'
    public router = Router({mergeParams: true})

    constructor(...props) {
        super(props);
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.use('/', authMiddleware)
        this.router.use('/tls', new TlsUploadController().router)
    }
}

export default UploadController