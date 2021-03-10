const express = require('express');
const router = express.Router({mergeParams: true});
const dockerService = require('../services/docker')

router.get('/containers', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.getContainers(docker.service).then((containers) => {
        let arr = []
        containers.forEach((container) => {
            arr.push({
                Id: container.Id,
                Name: container.Names[0].substr(1),
                Image: container.Image,
                ImageID: container.ImageID,
                Command: container.Command,
                Created: container.Created,
                Ports: container.Ports,
                Labels: container.Labels,
                State: container.State,
                Status: container.Status,
                HostConfig: container.HostConfig,
                NetworkSettings: container.NetworkSettings,
                Mounts: container.Mounts
            })
        })
        return res.send(arr.reverse())
    })
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

module.exports = router
