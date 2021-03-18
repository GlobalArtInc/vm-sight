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

router.get('/networks', (req, res) => {
    const {endpointId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        return docker.listNetworks()
            .then(networks => res.send(networks))
            .catch((err) => res.status(err.statusCode).send(err.json))
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
})

// NETWORKS

router.get('/containers', (req, res) => {

    const {endpointId} = req.params

    dockerService.connect(endpointId, true).then((docker) => {
        dockerService.getContainers(docker).then((containers) => {
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))

})

router.get('/containers/:containerId/logs', (req, res) => {
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
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
    }).catch(() => res.status(500).send({message: 'no_connection'}))
})

router.delete('/containers/:containerId', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.remove({force: true, v: 1}).then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    }).catch(() => res.status(500).send({message: 'no_connection'}))
})

router.post('/containers/:containerId/rename', async (req, res) => {
    const {endpointId, containerId} = req.params
    const {name} = req.query

    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.rename({name}).then(() => {
                return res.send({response: true})
            }).catch((err) => {
                return res.status(err.statusCode).send({message: err.json.message})
            })
        }
    }).catch(() => res.status(500).send({message: 'no_connection'}))
})

router.post('/containers/create', async (req, res) => {
    const {endpointId} = req.params

    dockerService.connect(endpointId, true).then((docker) => {
        docker.createContainer(req.body, function (err, container) {
            if (err) return res.status(err.statusCode).send(err)
            return res.send(container)
        });
    }).catch(() => res.status(500).send({message: 'no_connection'}))
})

router.post('/containers/:containerId/exec', async (req, res) => {
    const {endpointId, containerId} = req.params
    dockerService.connect(endpointId, true).then((docker) => {
        const container = docker.getContainer(containerId)
        if (container) {
            container.exec({Cmd: ['bash'], AttachStdin: true, AttachStdout: true}, function (err, exec) {
                exec.inspect()
                    .then((data) => res.send({Id: data.ID}))
                    .catch((err) => res.status(err.statusCode).send(err.json.message))
            });
        }
    }).catch(() => res.status(500).send({message: 'no_connection'}))
})


router.get('/version', (req, res) => {
    dockerService.connect(req.params.endpointId, true).then(docker => {
        docker.version().then(data => {
            return res.send(data)
        }).catch(err => res.status(err.statusCode).send(err.json))
    }).catch(() => res.status(500).send({message: 'no_connection'}))
})

router.get('/info', (req, res) => {
    dockerService.connect(req.params.endpointId, true).then(docker => {
        docker.info().then(data => {
            return res.send(data)
        }).catch(err => res.status(err.statusCode).send(err.json))
    }).catch(() => res.status(500).send({message: 'no_connection'}))
})

module.exports = router
