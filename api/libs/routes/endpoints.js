const express = require('express');
var app = express();

const router = express.Router();
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const Docker = require('dockerode');
const {getUserById} = require('../models/user')
const {getEndpoint, checkAccess} = require('../models/endpoints')
const dockerService = require('../services/docker')
const global = require('../global')
const fs = require('fs')

router.use('/', authMiddleware)

router.get('/', async (req, res) => {
    const user = await getUserById(req.user.id);
    if (user.role === 1) {
        db.query('SELECT * FROM endpoints').then(async (endpoints) => {
            if (endpoints.length > 0) {
                let arr = [];
                for (const endpointQ of endpoints) {
                    if (endpointQ.type === 1 || endpointQ.type === 2) {
                        const docker = await dockerService.connect(endpointQ.id)
                        const endpoint = await dockerService.getEndpoint(docker.endpoint, docker.service)
                        arr.push(endpoint)
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

router.get('/list/:id', async (req, res) => {
    const user = await getUserById(req.user.id);
    if (user.role === 1) {
        db.query(`SELECT id AS Id,
         name AS Name, 
         type AS Type,
         url AS URL,
         tls AS TLS,
         tls_ca as TLS_CA,
         tls_key as TLS_KEY,
         tls_cert as TLS_CERT
         FROM endpoints WHERE id = '${req.params.id}'`).then((endpoint) => {
            if (endpoint.length > 0) {
                const arr = {Id: "", Name: "", Type: 0, URL: ""};
                arr.Id = endpoint[0].Id
                arr.Name = endpoint[0].Name
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
        }).catch((err) => {
            return res.status(500).send(err)
        })
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.post('/list', async (req, res) => {
    const user = await getUserById(req.user.id);
    if (user.role === 1) {
        const {name, url, type} = req.body.data
        const d = req.body.type
        if (!name) {
            return res.status(400).send({message: "Endpoint name is not specified"})
        }
        if (d === '' || d === null) {
            if (!url) {
                return res.status(400).send({message: "URL is not specified"})
            }
        }
        const id = global.getGUID()
        if (type === 1) {
            if (d === 'socket') {
                db.query("SELECT * FROM endpoints WHERE url LIKE '%/var/run/docker.sock%'").then((e) => {
                    if (e.length > 0) {
                        return res.status(403).send({message: "endpoint_already_exists"})
                    } else {
                        dockerService.checkConnect(null, '/var/run/docker.sock').then(() => {
                            db.query(`INSERT INTO endpoints (id,name,type,url)VALUES('${id}','${name}','2', '/var/run/docker.sock')`).then(() => {
                                return res.send({response: true})
                            }).catch((err) => {
                                return res.status(500).send(err)
                            })
                        }).catch(() => {
                            return res.status(500).send({message: "Failed to connect to the server"})
                        })
                    }
                })
            }else {
                dockerService.checkConnect(null, url).then(() => {
                    db.query(`INSERT INTO endpoints (id,name,type,url)VALUES('${id}','${name}','1', '${url}')`).then(() => {
                        return res.send({response: true})
                    }).catch((err) => {
                        return res.status(500).send(err)
                    })
                }).catch(() => {
                    return res.status(500).send({message: "Failed to connect to the server"})
                })
            }
        } else {
            return res.status(400).send({message: "Incorrect type"})
        }
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.delete('/list/:id', async (req, res) => {
    const user = await getUserById(req.user.id);
    if (user.role === 1) {
        const endpoint = await db.query(`SELECT * FROM endpoints WHERE id = '${req.params.id}'`)
        if (endpoint.length > 0) {
            db.query(`DELETE FROM endpoints WHERE id = '${endpoint[0].id}'`).then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(500).send(err)
            })
        } else {
            return res.status(404).send({message: "Not Found"})
        }
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.put('/list/:id', async (req, res) => {
    const user = await getUserById(req.user.id);
    if (user.role === 1) {
        const endpoint = await db.query(`SELECT * FROM endpoints WHERE id = '${req.params.id}'`)
        if (endpoint.length > 0) {
            if (endpoint[0].type === 1) {
                const {name, tls, url} = req.body
                let tls_active, tls_ca, tls_cert, tls_key;

                if (tls) {
                    tls_active = tls.active
                    tls_ca = tls.ca
                    tls_cert = tls.cert
                    tls_key = tls.key
                }

                if (url) {
                    if (tls_active) {
                        let tls_ca_path = `./data/certs/${endpoint[0].id}/ca.pem`
                        if (fs.existsSync(tls_ca_path))
                            tls_ca = fs.readFileSync(tls_ca_path)

                        let tls_cert_path = `./data/certs/${endpoint[0].id}/cert.pem`
                        if (fs.existsSync(tls_cert_path))
                            tls_cert = fs.readFileSync(tls_cert_path)

                        let tls_key_path = `./data/certs/${endpoint[0].id}/key.pem`
                        if (fs.existsSync(tls_key_path))
                            tls_key = fs.readFileSync(tls_key_path)


                        dockerService.checkConnect(req.params.id, url, {
                            ca: tls_ca,
                            cert: tls_cert,
                            key: tls_key
                        }).then(async () => {
                            if (tls_ca) {
                                await db.query(`UPDATE endpoints SET tls=1, tls_ca=1 WHERE id = '${endpoint[0].id}'`)
                            }
                            if (tls_cert) {
                                await db.query(`UPDATE endpoints SET tls=1, tls_cert=1 WHERE id = '${endpoint[0].id}'`)
                            }
                            if (tls_key) {
                                await db.query(`UPDATE endpoints SET tls=1, tls_key=1 WHERE id = '${endpoint[0].id}'`)
                            }
                            return res.send({response: true})
                            //return res.send({response: true})
                        }).catch(() => {
                            return res.status(500).send({message: "Failed to connect to the server"})
                        })
                    } else {
                        await db.query(`UPDATE endpoints SET tls=0, tls_ca=0, tls_cert=0, tls_key=0 WHERE id = '${endpoint[0].id}'`)
                        dockerService.checkConnect(req.params.id, url).then(() => {
                            return res.send({response: true})
                        }).catch(() => {
                            return res.status(500).send({message: "Failed to connect to the server"})
                        })
                    }
                } else {
                    return res.status(400).send({message: "Endpoint URL is not specified"})
                }

                if (name) {
                    await db.query(`UPDATE endpoints SET name = '${name}' WHERE id = '${endpoint[0].id}'`)
                }
            } else if (endpoint[0].type === 2) {
                const name = req.body.name

                if (name) {
                    db.query(`UPDATE endpoints SET name = '${name}' WHERE id = '${endpoint[0].id}'`).then(() => {
                        return res.send({response: true})
                    }).catch((err) => res.send(err))
                } else {
                    return res.status(405).send({message: 'Name is not specified'})
                }
            }
        } else {
            return res.status(404).send({message: "Not Found"})
        }
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.get('/list', async (req, res) => {
    const user = await getUserById(req.user.id);
    if (user.role === 1) {
        db.query(`SELECT id AS Id,
         name AS Name, 
         type AS Type,
         url AS URL,
         tls AS TLS
         FROM endpoints`).then((endpoints) => {
            return res.send(endpoints)
        }).catch((err) => {
            return res.status(500).send(err)
        })
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.get('/:id', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    const endpoint = await dockerService.getEndpoint(docker.endpoint, docker.service)
    if (endpoint) {
        return res.send(endpoint)
    } else {
        return res.status(404).send({message: "Not Found"})
    }
})

router.get('/:id/docker/containers', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    const containers = await dockerService.getContainers(docker.service)
    return res.send(containers)
})

router.get('/:id/docker/containers/:hash', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    return dockerService.getContainer(docker.service, req.params.hash).then((data) => {
        return res.send(data)
    }).catch((err) => {
        return res.status(err.statusCode).send(err)
    })
})

router.post('/:id/docker/containers/:hash/start', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.startContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/:id/docker/containers/:hash/restart', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.restartContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/:id/docker/containers/:hash/stop', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.stopContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/:id/docker/containers/:hash/kill', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.killContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/:id/docker/containers/:hash/pause', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.pauseContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(err.statusCode).send(err)
    })
})

router.post('/:id/docker/containers/:hash/unpause', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.unpauseContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(err.statusCode).send(err)
    })
})

router.get('/:id/docker/version', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    return res.send(await dockerService.getVersion(docker.service))
})

router.get('/:id/docker/info', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    return res.send(await dockerService.getInfo(docker.service))
})

module.exports = router;
