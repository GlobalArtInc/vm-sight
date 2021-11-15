import App from "../../app";
import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import dockerService from "../../services/dockerService";
import HttpException from "../../exceptions/HttpException";
import NotFoundException from "../../exceptions/NotFoundException";
import * as fs from 'fs';
import * as multer from 'multer'
import {dataDir} from "../../constants";
import {dbQuery} from "../../utils/DB";
import ForbiddenException from "../../exceptions/ForbiddenException";

class TlsUploadController extends App implements Controller {
    public path = '/tls'
    public router = Router({mergeParams: true})

    constructor(...props) {
        super(props);
        this.initializeRoutes()
    }

    private initializeRoutes() {

        const storage = multer.diskStorage(
            {
                destination: function (req, file, cb) {
                    const certs_dir = `${dataDir}/certs/`
                    if (!fs.existsSync(certs_dir)) {
                        fs.mkdirSync(certs_dir);
                    }
                    const dir = `${dataDir}/certs/` + req.query.folder
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    cb(null, `${dataDir}/certs/` + req.query.folder)
                },
                filename: function (req, file, cb) {
                    cb(null, file.originalname);
                }
            }
        );


        const upload = multer({storage: storage});

        this.router.delete('/:endpointId', async (req: IRequest, res: IResponse, next: INext) => {
            const {endpointId} = req.params
            if (fs.existsSync(`${dataDir}/certs/${endpointId}`)) {
                fs.rmSync(`${dataDir}/certs/${endpointId}`, {recursive: true})
                const endpoint = await dbQuery(`SELECT * FROM endpoints WHERE id = '${endpointId}'`)
                if (endpoint['length'] > 0) {
                    if (endpoint[0].tls_active === 1) {
                        await dbQuery(`UPDATE endpoints SET tls = 0 WHERE id = '${endpointId}'`)
                    }
                }
                return res.send({status: 200, message: "The TLS has been deleted."})
            } else {
                return next(new ForbiddenException())
            }
        })

        this.router.post('/ca', upload.single('file'), async (req: IRequest, res: IResponse, next: INext) => {
            const {folder} = req.query
            if (folder) {
                return res.send({response: true})
            } else {
                return next(new HttpException(400, "Incorrect a folder"))
            }
        })
        this.router.post('/cert', upload.single('file'), async (req: IRequest, res: IResponse, next: INext) => {
            const {folder} = req.query
            if (folder) {
                return res.send({response: true})
            } else {
                return next(new HttpException(400, "Incorrect a folder"))
            }
        })
        this.router.post('/key', upload.single('file'), async (req: IRequest, res: IResponse, next: INext) => {
            const {folder} = req.query
            if (folder) {
                return res.send({response: true})
            } else {
                return next(new HttpException(400, "Incorrect a folder"))
            }
        })


        this.router.get('*', (req: IRequest, res: IResponse, next: INext) => {
            return next(new NotFoundException)
        })
    }
}

export default TlsUploadController