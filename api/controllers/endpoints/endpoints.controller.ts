import Controller from "../../interfaces/controller.interface";
import * as fs from 'fs';
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
import {dataDir} from "../../constants";

class EndpointsController extends App implements Controller {
    public path = '/endpoints'
    public router = Router()

    constructor(...props) {
        super(props);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use('/', authMiddleware)
        this.router.use('/:endpointId/docker', new DockerController().router)

        this.router.get('/', async (req: IRequest, res: IResponse) => {
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

        this.router.get('/list', async (req: IRequest, res: IResponse, next: INext) => {
            const user = await getUserById(req.user.id);
            if (user.role === 1) {
                try {
                    const endpoints = await dbQuery('SELECT id AS Id, name AS Name, type AS Type, url AS URL, tls AS TLS FROM endpoints')
                    return res.send(endpoints)
                } catch (err) {
                    next(new HttpException(err.status, err.message))
                }
            } else {
                next(new ForbiddenException)
            }
        })

        this.router.post('/list', async (req: IRequest, res: IResponse, next: INext) => {
            const user = await getUserById(req.user.id);
            if (user.role === 1) {
                const {name, url, type, tls} = req.body.data
                const tempId = req.body.tempId
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

                                service.checkConnect('/var/run/docker.sock').then(() => {
                                    dbQuery(`INSERT INTO endpoints (id,name,type,url,public_url)VALUES('${id}','${name}','2', '/var/run/docker.sock', 'http://127.0.0.1')`).then(() => {
                                        return res.send({response: true})
                                    }).catch((err) => {
                                        next(new HttpException(500, err))
                                    })
                                }).catch(() => {
                                    return next(new HttpException(500, "Failed to connect to the server"))
                                })
                            }
                        })
                    } else {
                        const service = new dockerService()
                        if (tls.active === true) {
                            let tls_active, tls_ca, tls_cert, tls_key;
                            if (tls) {
                                tls_active = tls.active
                                tls_ca = tls.ca
                                tls_cert = tls.cert
                                tls_key = tls.key
                            }

                            let tls_ca_path = `${dataDir}/certs/${tempId}/ca.pem`

                            if (fs.existsSync(tls_ca_path))
                                tls_ca = fs.readFileSync(tls_ca_path)

                            let tls_cert_path = `${dataDir}/certs/${tempId}/cert.pem`
                            if (fs.existsSync(tls_cert_path))
                                tls_cert = fs.readFileSync(tls_cert_path)

                            let tls_key_path = `${dataDir}/certs/${tempId}/key.pem`
                            if (fs.existsSync(tls_key_path))
                                tls_key = fs.readFileSync(tls_key_path)

                            service.checkConnect(url, {
                                ca: tls_ca,
                                cert: tls_cert,
                                key: tls_key
                            }).then(async () => {
                                await dbQuery(`INSERT INTO endpoints (id,name,type,url)VALUES('${id}','${name}','1', '${url}')`)

                                if (tls_ca) {
                                    await dbQuery(`UPDATE endpoints SET tls=1, tls_ca=1 WHERE id = '${id}'`)
                                }
                                if (tls_cert) {
                                    await dbQuery(`UPDATE endpoints SET tls=1, tls_cert=1 WHERE id = '${id}'`)
                                }
                                if (tls_key) {
                                    await dbQuery(`UPDATE endpoints SET tls=1, tls_key=1 WHERE id = '${id}'`)
                                }

                                fs.renameSync(`${dataDir}/certs/${tempId}`, `${dataDir}/certs/${id}`)

                                return res.send({response: true})
                            }).catch(() => {
                                fs.rmSync(`${dataDir}/certs/${tempId}`, {recursive: true})
                                return next(new HttpException(500, "Failed to connect to the server"))
                            })
                        } else {
                            service.checkConnect(url).then(() => {
                                dbQuery(`INSERT INTO endpoints (id,name,type,url)VALUES('${id}','${name}','1', '${url}')`).then(() => {
                                    return res.send({response: true})
                                })
                            }).catch(() => {
                                return next(new HttpException(500, "Failed to connect to the server"))
                            })
                        }
                    }
                }

            } else {
                next(new ForbiddenException)
            }
        })

        this.router.get('/list/:endpointId', async (req: IRequest, res: IResponse) => {
            const user = await getUserById(req.user.id);
            if (user.role === 1) {
                const endpoint = await dbQuery(`SELECT id AS Id,
                                                      name AS Name, 
                                                      type AS Type,
                                                      url AS URL,
                                                      public_url as PublicURL,
                                                      tls AS TLS,
                                                      tls_ca as TLS_CA,
                                                      tls_key as TLS_KEY,
                                                      tls_cert as TLS_CERT
                                                      FROM endpoints WHERE id = '${req.params.endpointId}'`)

                if (endpoint['length'] > 0) {
                    const arr = {
                        Id: "",
                        Name: "",
                        PublicURL: "",
                        Type: 0,
                        URL: "",
                        TLS: 0,
                        TLS_CA: 0,
                        TLS_CERT: 0,
                        TLS_KEY: 0
                    };
                    arr.Id = endpoint[0].Id
                    arr.Name = endpoint[0].Name
                    arr.PublicURL = endpoint[0].PublicURL
                    arr.Type = endpoint[0].Type
                    arr.URL = endpoint[0].URL
                    if (arr.Type === 1) {
                        arr.TLS = endpoint[0].TLS
                        arr.TLS_CA = endpoint[0].TLS_CA
                        arr.TLS_CERT = endpoint[0].TLS_CERT
                        arr.TLS_KEY = endpoint[0].TLS_KEY
                    }
                    return res.send(arr)
                } else {
                    return res.status(404).send({message: "Not Found"})
                }

            } else {
                return res.status(403).send({message: "Forbidden"})
            }
        })

        this.router.delete('/list/:endpointId', async (req: IRequest, res: IResponse, next: INext) => {
            const {endpointId} = req.params
            const user = await getUserById(req.user.id);
            if (user.role === 1) {
                const endpoint = await dbQuery(`SELECT * FROM endpoints WHERE id = '${endpointId}'`)
                if (endpoint['length'] > 0) {
                    await dbQuery(`DELETE FROM endpoints WHERE id = '${endpointId}'`)
                    return res.send({status: 200, message: "The endpoint has been deleted."})
                } else {
                    return next(new NotFoundException())
                }
            } else {
                return next(new ForbiddenException())
            }
        })

        this.router.put('/list/:endpointId', async (req: IRequest, res: IResponse, next: INext) => {
            const user = await getUserById(req.user.id);
            if (user.role === 1) {
                const endpoint = await dbQuery(`SELECT * FROM endpoints WHERE id = '${req.params.endpointId}'`)
                if (endpoint['length'] > 0) {
                    if (endpoint[0].type === 1) {
                        const {name, tls, url, public_url} = req.body
                        let tls_active, tls_ca, tls_cert, tls_key;

                        if (tls) {
                            tls_active = tls.active
                            tls_ca = tls.ca
                            tls_cert = tls.cert
                            tls_key = tls.key
                        }

                        const service = new dockerService()

                        if (url) {
                            if (tls_active) {
                                let tls_ca_path = `${dataDir}/certs/${endpoint[0].id}/ca.pem`

                                if (fs.existsSync(tls_ca_path))
                                    tls_ca = fs.readFileSync(tls_ca_path)

                                let tls_cert_path = `${dataDir}/certs/${endpoint[0].id}/cert.pem`
                                if (fs.existsSync(tls_cert_path))
                                    tls_cert = fs.readFileSync(tls_cert_path)

                                let tls_key_path = `${dataDir}/certs/${endpoint[0].id}/key.pem`
                                if (fs.existsSync(tls_key_path))
                                    tls_key = fs.readFileSync(tls_key_path)

                                try {
                                    await service.checkConnect(url, {
                                        ca: tls_ca,
                                        cert: tls_cert,
                                        key: tls_key
                                    })
                                    if (tls_ca) {
                                        await dbQuery(`UPDATE endpoints SET tls=1, tls_ca=1 WHERE id = '${endpoint[0].id}'`)
                                    }
                                    if (tls_cert) {
                                        await dbQuery(`UPDATE endpoints SET tls=1, tls_cert=1 WHERE id = '${endpoint[0].id}'`)
                                    }
                                    if (tls_key) {
                                        await dbQuery(`UPDATE endpoints SET tls=1, tls_key=1 WHERE id = '${endpoint[0].id}'`)
                                    }
                                } catch (err) {
                                    return next(new HttpException(500, "Failed to connect to the server"))
                                }
                            }
                        } else {
                            return next(new HttpException(400, 'The endpoint url is not specified'))
                        }

                        if (name) {
                            await dbQuery(`UPDATE endpoints SET name = '${name}' WHERE id = '${endpoint[0].id}'`)
                        }

                        if (public_url) {
                            await dbQuery(`UPDATE endpoints SET public_url = '${public_url}' WHERE id = '${endpoint[0].id}'`)
                        }
                        if (url) {
                            await dbQuery(`UPDATE endpoints SET url = '${url}' WHERE id = '${endpoint[0].id}'`)
                        }

                        return res.send({status: 200, message: "The endpoint has been saved."})
                    } else if (endpoint[0].type === 2) {
                        const {name, public_url} = req.body

                        if (name) {
                            await dbQuery(`UPDATE endpoints SET name = '${name}' WHERE id = '${endpoint[0].id}'`)
                        }
                        if (public_url) {
                            await dbQuery(`UPDATE endpoints SET public_url = '${public_url}' WHERE id = '${endpoint[0].id}'`)
                        }

                        return res.send({status: 200, message: "The endpoint has been saved."})
                    }
                } else {
                    return next(new NotFoundException())
                }
            } else {
                return next(new ForbiddenException())
            }
        })

        this.router.get('/:endpointId', async (req: IRequest, res: IResponse, next: INext) => {
            const service = new dockerService()
            await service.connect(req.params.endpointId)
            const endpoint = await service.getEndpoint()
            if (endpoint)
                return res.send(endpoint)
            else
                return next(new NotFoundException)
        })

    }


}

export default EndpointsController