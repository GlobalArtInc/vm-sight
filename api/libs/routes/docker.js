const express = require('express');
const router = express.Router({mergeParams: true});
const dockerService = require('../services/docker')


// IMAGES

router.get('/images', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.getImages(docker.service).then((images) => {
        return res.send(images)
    }).catch(() => {
        return res.status(404).send({message: "Not Found"})
    })
})

// IMAGES

// NETWORKS

router.get('/networks', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.getNetworks(docker.service).then((data) => {
        return res.send(data)
    }).catch(() => {
        return res.status(404).send({message: "Not Found"})
    })
})

router.get('/networks/:hash', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.getNetwork(docker.service, req.params.hash).then((data) => {
        return res.send(data)
    }).catch(() => {
        return res.status(404).send({message: "Not Found"})
    })
})

router.post('/networks/:hash/connect', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    const {Container} = req.body
    dockerService.connectNetwork(docker.service, req.params.hash, Container).then((data) => {
        return res.send(data)
    }).catch((err) => {
        return res.status(err.statusCode).send(err.json)
    })
})

router.post('/networks/:hash/disconnect', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    const {Container} = req.body
    dockerService.disconnectNetwork(docker.service, req.params.hash, Container).then((data) => {
        return res.send(data)
    }).catch(() => {
        return res.status(404).send({message: "Not Found"})
    })
})

// NETWORKS

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
        return res.send(arr)
    }).catch(() => {
        return res.status(404).send({message: "Not Found"})
    })
})


router.get('/containers/:hash', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    return dockerService.getContainer(docker.service, req.params.hash).then((data) => {
        return res.send(data)
    }).catch((err) => {
        return res.status(err.statusCode).send(err)
    })
})

router.get('/containers/:hash/logs', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)

    dockerService.logsContainer(docker.service, req.params.hash, req.query).then((data) => {
        return res.send(data)
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/containers/:hash/start', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.startContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/containers/:hash/restart', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.restartContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/containers/:hash/stop', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.stopContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/containers/:hash/kill', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.killContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(403).send(err)
    })
})

router.post('/containers/:hash/pause', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.pauseContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(err.statusCode).send(err)
    })
})

router.post('/containers/:hash/resume', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.unpauseContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(err.statusCode).send(err)
    })
})

router.post('/containers/:hash/remove', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    dockerService.removeContainer(docker.service, req.params.hash).then(() => {
        return res.send({response: true})
    }).catch((err) => {
        return res.status(err.statusCode).send(err)
    })
})

router.post('/containers/:hash/exec', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)

    dockerService.startExec(docker.service, req.params.hash).then((data) => {
        return res.send({Id: data.ID})
    }).catch((err) => {
        return res.status(err.statusCode).send(err)
    })
})


router.get('/version', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    return res.send(await dockerService.getVersion(docker.service))
})

router.get('/info', async (req, res) => {
    const docker = await dockerService.connect(req.params.id)
    return res.send(await dockerService.getInfo(docker.service))
})

module.exports = router
