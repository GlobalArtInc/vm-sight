const db = require('../db')
const Docker = require('dockerode')
const fs = require('fs')

module.exports.connect = (id) => {
    return db.query(`SELECT * FROM endpoints WHERE id = '${id}'`).then((endpoint) => {
        if (endpoint.length > 0) {
            let settings = (endpoint[0].url.match('/var/run/docker.sock')) ?
                {socketPath: '/var/run/docker.sock'} : {
                    host: endpoint[0].url.split(':')[0],
                    port: endpoint[0].url.split(':')[1]
                };
            if (endpoint[0].tls === 1) {

                if (endpoint[0].tls_ca === 1) {
                    const path = `./data/certs/${endpoint[0].id}/ca.pem`
                    if (fs.existsSync(path))
                        settings.ca = fs.readFileSync(path)
                }
                if (endpoint[0].tls_cert === 1) {
                    const path = `./data/certs/${endpoint[0].id}/cert.pem`
                    if (fs.existsSync(path))
                        settings.cert = fs.readFileSync(path)
                }
                if (endpoint[0].tls_key === 1) {
                    const path = `./data/certs/${endpoint[0].id}/key.pem`
                    if (fs.existsSync(path))
                        settings.key = fs.readFileSync(path)
                }
                const service = new Docker(settings)
                return {endpoint: endpoint[0], service: service};
            } else {
                const service = new Docker(settings)
                return {endpoint: endpoint[0], service: service};
            }
        } else {
            return false;
        }
    })

}

const getEndpoint = (endpoint) => {
    return {
        Id: endpoint.id,
        Name: endpoint.name,
        Type: endpoint.type,
        GroupId: endpoint.groupId,
        Status: endpoint.status,
        URL: endpoint.url,
        PublicURL: endpoint.publicURL,
        Snapshot: endpoint.snapshot
    };
}

module.exports.checkConnect = async (id, host, data = {
    ca: false,
    cert: false,
    key: false
}) => {
    let settings = (host.match('/var/run/docker.sock')) ?
        {socketPath: '/var/run/docker.sock'} : {
            host: host.split(':')[0],
            port: host.split(':')[1]
        };
    if (data.ca) {
        settings.ca = data.ca
    }
    if (data.cert) {
        settings.cert = data.cert
    }
    if (data.key) {
        settings.key = data.key
    }
    return new Promise(((resolve, reject) => {
        if (settings.host && !settings.port) reject()
        new Docker(settings).version().then(() => {
            resolve()
        }).catch((err) => {
            reject(err)
        })
    }))
}

module.exports.snapshot = (data) => {
    return {
        DockerVersion: data.DockerVersion ? data.DockerVersion : "",
        Containers: data.Containers ? data.Containers : 0,
        RunningContainerCount: data.ContainersRunning ? data.ContainersRunning : 0,
        StoppedContainerCount: data.ContainersStopped ? data.ContainersStopped : 0,
        HealthyContainerCount: data.HealthyContainerCount ? data.HealthyContainerCount : 0,
        UnhealthyContainerCount: data.UnhealthyContainerCount ? data.UnhealthyContainerCount : 0,
        ImageCount: data.ImageCount ? data.ImageCount : 0,
        ServiceCount: data.ServiceCount ? data.ServiceCount : 0,
        StackCount: data.StackCount ? data.StackCount : 0,
        Swarm: data.Swarm ? data.Swarm : false,
        Time: data.Time ? data.Time : 0,
        TotalCPU: data.TotalCPU ? data.TotalCPU : 0,
        TotalMemory: data.TotalMemory ? data.TotalMemory : 0,
        VolumeCount: data.VolumeCount ? data.VolumeCount : 0
    }
}

module.exports.getEndpoint = (endpoint, docker) => {
    if (docker) {
        return docker.version().then(async () => {
            const snap = await db.query(`SELECT * FROM snapshots WHERE endpoint_id = '${endpoint.id}'`)
            let snapshot;
            const timestamp = Math.floor(new Date() / 1000)
            if (snap.length === 0 || snap[0].createdAt + 300 < timestamp) {
                const info = await docker.info()
                const containers = await docker.listContainers()
                const volumes = await docker.listVolumes()
                const swarm = info.Swarm

                const healthy = containers.filter(i => {
                    return i.Status.match('(healthy)');
                })
                const unhealthy = containers.filter(i => {
                    return i.Status.match('(unhealthy)');
                })
                snapshot = this.snapshot({
                    DockerVersion: info.ServerVersion,
                    Containers: info.Containers,
                    RunningContainerCount: info.ContainersRunning,
                    StoppedContainerCount: info.ContainersStopped,
                    HealthyContainerCount: healthy.length,
                    UnhealthyContainerCount: unhealthy.length,
                    ImageCount: Object.keys(await this.getImages(docker)).length,
                    ServiceCount: swarm.LocalNodeState === 'active' ? docker.listServices().length : 0,
                    StackCount: 0,
                    Swarm: swarm.LocalNodeState === 'active',
                    Time: Math.floor(new Date(info.SystemTime).getTime() / 1000),
                    TotalCPU: info.NCPU,
                    TotalMemory: info.MemTotal,
                    VolumeCount: volumes.Volumes.length
                })
                if (snap.length > 0 && snap[0].createdAt + 300 < timestamp) {
                    await db.query(`UPDATE snapshots SET data = '${JSON.stringify(snapshot)}', createdAt = strftime('%s', 'now') WHERE endpoint_id = '${endpoint.id}'`)
                } else {
                    await db.query(`INSERT INTO snapshots (endpoint_id, data, createdAt) VALUES ('${endpoint.id}', '${JSON.stringify(snapshot)}', strftime('%s', 'now'))`)
                }
            } else {
                const data = JSON.parse(snap[0].data)
                snapshot = this.snapshot(data)
            }


            // containers[0].map(containers => {
            //  // console.log(containers)
            // })

            return getEndpoint({
                id: endpoint.id,
                name: endpoint.name,
                type: endpoint.type,
                groupId: endpoint.groupId,
                status: 1,
                publicURL: endpoint.publicURL,
                url: endpoint.url,
                snapshot: snapshot
            })

        }).catch(() => {
            return getEndpoint({
                id: endpoint.id,
                name: endpoint.name,
                type: endpoint.type,
                groupId: endpoint.groupId,
                status: 0,
                publicURL: endpoint.publicURL,
                url: endpoint.url,
                snapshot: this.snapshot({})
            })
        })
    } else {
        return false
    }
}

module.exports.getVersion = async (docker) => {
    return await docker.version()
}

module.exports.getInfo = async (docker) => {
    return await docker.info()
}

module.exports.getImages = (docker) => {
    return new Promise((resolve, reject) => {
        docker.listImages().then(data => {
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })

}

module.exports.logsContainer = (docker, hash, options) => {
    const container = docker.getContainer(hash)
    if (container) {
        return container.logs(options).then((data) => {
            return data;
        })
    } else {
        return false;
    }
}

module.exports.getContainer = (docker, hash) => {
    const container = docker.getContainer(hash)
    if (container) {
        return container.inspect().then(((data) => {
            return data;
            /*return {
                Id: data.Id,
                Name: data.Name.substr(1),
                Image: data.Image,
                ImageID: data.ImageID,
                Command: data.Command,
                Created: data.Created,
                Ports: data.Ports,
                Labels: data.Labels,
                State: data.State,
                Status: data.Status,
                HostConfig: data.HostConfig,
                NetworkSettings: data.NetworkSettings,
                Mounts: data.Mounts
            }; */
        }))
    } else {
        return false;
    }
}

module.exports.startContainer = (docker, hash) => {
    const container = docker.getContainer(hash)
    if (container) {
        return new Promise((resolve, reject) => {
            return container.start().then((() => {
                resolve()
            })).catch((err) => {
                return reject(err)
            })
        })
    } else {
        return false;
    }
}

module.exports.restartContainer = (docker, hash) => {
    const container = docker.getContainer(hash)
    if (container) {
        return new Promise((resolve, reject) => {
            return container.restart().then((() => {
                resolve()
            })).catch((err) => {
                reject(err)
            })
        })
    } else {
        return false;
    }
}

module.exports.stopContainer = (docker, hash) => {
    const container = docker.getContainer(hash)
    if (container) {
        return new Promise((resolve, reject) => {
            container.stop().then((() => {
                resolve()
            })).catch((err) => reject(err))
        })
    } else {
        return false;
    }
}

module.exports.killContainer = (docker, hash) => {
    const container = docker.getContainer(hash)
    if (container) {
        return new Promise((resolve, reject) => {
            container.kill().then((() => {
                resolve()
            })).catch((err) => {
                reject(err)
            })
        })
    } else {
        return false;
    }
}


module.exports.pauseContainer = (docker, hash) => {
    const container = docker.getContainer(hash)
    if (container) {
        return new Promise((resolve, reject) => {
            container.pause().then((() => {
                resolve()
            })).catch((err) => {
                reject(err)
            })
        })
    } else {
        return false;
    }
}

module.exports.unpauseContainer = async (docker, hash) => {
    const container = docker.getContainer(hash)
    if (container) {
        return new Promise((resolve, reject) => {
            container.unpause().then((() => {
                resolve()
            })).catch((err) => {
                reject(err)
            })
        })
    } else {
        return false;
    }
}
module.exports.removeContainer = async (docker, hash) => {
    const container = docker.getContainer(hash)
    if (container) {
        return new Promise((resolve, reject) => {
            container.remove({force: true}).then((() => {
                resolve()
            })).catch((err) => {
                reject(err)
            })
        })
    } else {
        return false;
    }
}

module.exports.getContainers = async (docker) => {
    return docker.listContainers({all:1}).then((containers) => {
        let arr = [];
        containers.forEach((item) => {
            arr.push(item)
        })
        return arr;
    }).catch(() => {
        return false
    })
}

// IMAGES
module.exports.getImages = async (docker) => {
    return docker.listImages({all: 0}).then(images => {
        return images;
    }).catch(() => {
        return false
    })
}
