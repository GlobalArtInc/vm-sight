const express = require('express');
const router = express.Router({mergeParams: true});
const dockerService = require('../services/docker')


// IMAGES

router.get('/images', async (req, res) => {
    const {endpointId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        docker.listImages().then(images => {
            return res.send(images)
        }).catch(() => {
            return res.status(404).send({message: "Not Found"})
        })
    })
})

// IMAGES

// NETWORKS

router.get('/networks', async (req, res) => {
    const docker = await dockerService.connect(req.params.endpointId)
    dockerService.getNetworks(docker.service).then((data) => {
        return res.send(data)
    }).catch(() => {
        return res.status(404).send({message: "Not Found"})
    })
})

router.get('/networks/:networkId', async (req, res) => {
    const {endpointId, networkId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const network = docker.getNetwork(networkId)

        if (network) {
            network.inspect().then((data) => {
                return res.send(data)
            }).catch((err) => {
                return res.status(err.statusCode).send(err)
            })
        }
    })
})

router.post('/networks/:networkId/connect', async (req, res) => {
    const {endpointId, networkId} = req.params
    const {Container} = req.body

    dockerService.connect(endpointId, true).then((docker) => {
        const network = docker.getNetwork(networkId)

        if (network) {
            network.connect({Container, Force: true}).then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send(err)
            })
        }
    })
})

router.post('/networks/:networkId/disconnect', async (req, res) => {
    const {endpointId, networkId} = req.params
    const {Container} = req.body

    dockerService.connect(endpointId, true).then((docker) => {
        const network = docker.getNetwork(networkId)

        if (network) {
            network.disconnect({Container, Force: true}).then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send(err)
            })
        }
    })
})

// NETWORKS

router.get('/containers', async (req, res) => {
    const docker = await dockerService.connect(req.params.endpointId)
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


router.get('/containers/:containerId', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.inspect().then(inspect => {
                return res.send(inspect)
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })

})

router.get('/containers/:containerId/logs', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.logs(req.query).then(inspect => {
                return res.send(inspect)
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/start', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.start().then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/restart', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.restart().then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/stop', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.stop().then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/kill', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.kill().then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/pause', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.pause().then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/resume', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.unpause().then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/remove', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.remove().then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/recreate', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.remove().then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    })
})

router.post('/containers/:containerId/exec', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.exec({Cmd: ['bash'], AttachStdin: true, AttachStdout: true}, function (err, exec) {
                exec.inspect()
                    .then((stream) => res.send(stream))
                    .catch((err) => res.status(err.statusCode).send(err.json.message))
            });
        }
    })
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
