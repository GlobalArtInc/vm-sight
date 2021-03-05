const express = require('express');

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
        db.query('SELECT * FROM endpoints').then((endpoints) => {
            const promises = endpoints
                .map((i) => {
                    // DOCKER
                    if (i.type === 1) {
                        const result = {
                            Id: i.id,
                            Name: i.name,
                            Type: i.type,
                            URL: i.url,
                            GroupId: i.groupId,
                            Snapshots: []
                        };

                        const settings = (i.url.match('unix:///var/run/docker.sock')) ?
                            {socketPath: '/var/run/docker.sock'} : {
                                host: i.url.split(':')[0],
                                port: i.url.split(':')[1]
                            };
                        const docker = new Docker(settings);

                        return docker.version(undefined).then(() => {
                            result.Status = 1
                            return result;
                        }).catch(() => {
                            result.Status = 0
                            return result
                        })
                    } else if (i.type === 2) {
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
            endpoints.forEach(async (endpoint) => {
                const docker = dockerService.connect(endpoint)
                console.log(docker)
                return res.send(await dockerService.getVersion(docker))
            })
        })
    } else {
        return res.send([])
    }
    return res.send({response: true})
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

module.exports = router;