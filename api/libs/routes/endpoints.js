const express = require('express');
var app = express();

const router = express.Router();
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const Docker = require('dockerode');
const {getUserById} = require('../models/user')
const {getEndpoint, checkAccess} = require('../models/endpoints')
const dockerService = require('../services/docker')

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

router.get('/list/:id', async(req,res) => {
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
                 return res.send(endpoint[0])
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

/*
router.get('/', async (req, res) => {
    const user = await getUserById(req.user.id);
    if (user.role === 1) {
        db.query('SELECT * FROM endpoints').then((endpoints) => {
            const promises = endpoints
                .map((endpoint) => {
                    // DOCKER
                    if (endpoint.type === 1) {

                        const docker = dockerService.connect(endpoint)

                        return dockerService.getInfo(docker).then((r) => {

                            const {ServerVersion, Images, ContainersRunning, } = r;

                            const result = {
                                Id: endpoint.id,
                                Name: endpoint.name,
                                Type: endpoint.type,
                                URL: endpoint.url,
                                GroupId: endpoint.groupId,
                                Stat: {
                                    DockerVersion: ServerVersion,
                                    ImageCount: Images,
                                    RunningContainerCount: ContainersRunning
                                },
                                Snapshots: []
                            };
                            return docker.version(undefined).then(() => {
                                result.Status = 1
                                return result;
                            }).catch(() => {
                                result.Status = 0
                                return result
                            })
                        })


                    } else if (endpoint.type === 2) {
                        // KUBERNETES
                    }
                });

            Promise.all(promises).then((results) => res.send(results))
        })
    } else {
        return res.send([])
    }
});


router.get('/snapshots', async (req, res) => {
    const user = await getUserById(req.user.id);

    if (user.role === 1) {
        db.query('SELECT * FROM endpoints').then((endpoints) => {
            endpoints.forEach((endpoint) => {
                const docker = dockerService.connect(endpoint)
                console.log(dockerService.getSnapshot(docker))
                return res.send({response: true})
            })
        })
    } else {
        return res.send([])
    }
});

router.get('/:id/docker/version', async (req, res) => {
    if (checkAccess(req.params.id)) {
        const endpoint = await getEndpoint(req.params.id)
        if (endpoint) {
            const docker = dockerService.connect(endpoint)
            return res.send(await dockerService.getVersion(docker))
        }
    } else {
        return res.status(403).send({msg: "Forbidden"})
    }
})

router.get('/:id/docker/info', async (req, res) => {
    if (checkAccess(req.params.id)) {
        const endpoint = await getEndpoint(req.params.id)
        if (endpoint) {
            const docker = dockerService.connect(endpoint)
            return res.send(await dockerService.getInfo(docker))
        }
    } else {
        return res.status(403).send({msg: "Forbidden"})
    }
})

router.get('/:id/docker/containers/json', async (req, res) => {
    if (checkAccess(req.params.id)) {
        const endpoint = await getEndpoint(req.params.id)
        if (endpoint) {
            const docker = dockerService.connect(endpoint)
            return res.send(await dockerService.getContainers(docker))
        }
    } else {
        return res.status(403).send({msg: "Forbidden"})
    }
})
*/
module.exports = router;
