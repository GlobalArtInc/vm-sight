import * as fs from 'fs';
import {dbQuery} from "../utils/DB";
import * as Docker from 'dockerode';
import {dataDir} from "../constants";

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


class dockerService {
    public service = new Docker();
    public endpoint: any;

    constructor() {

    }

    public async connect(endpointId) {
        return dbQuery(`SELECT * FROM endpoints WHERE id = '${endpointId}'`).then((endpoint) => {
            if (endpoint['length'] > 0) {
                this.endpoint = endpoint[0]
                let settings: any = (endpoint[0].url.match('/var/run/docker.sock')) ?
                    {socketPath: '/var/run/docker.sock'} :
                    {
                        host: endpoint[0].url.split(':')[0],
                        port: endpoint[0].url.split(':')[1]
                    };

                if (endpoint[0].tls === 1) {
                    if (endpoint[0].tls_ca === 1) {
                        const path = `${dataDir}/certs/${endpoint[0].id}/ca.pem`
                        if (fs.existsSync(path))
                            settings.ca = fs.readFileSync(path)
                    }
                    if (endpoint[0].tls_cert === 1) {
                        const path = `${dataDir}/certs/${endpoint[0].id}/cert.pem`
                        if (fs.existsSync(path))
                            settings.cert = fs.readFileSync(path)
                    }
                    if (endpoint[0].tls_key === 1) {
                        const path = `${dataDir}/certs/${endpoint[0].id}/key.pem`
                        if (fs.existsSync(path))
                            settings.key = fs.readFileSync(path)
                    }
                }
                this.service = new Docker(settings)
            } else {
                this.endpoint = false
            }
        })
    }

    public checkConnect(host, data: any = {ca: false, ert: false, key: false}) {
        let settings: any = (host.match('/var/run/docker.sock')) ?
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
                resolve(true)
            }).catch((err) => {
                reject(err)
            })
        }))

    }

    public async getEndpoint() {
        if (this.endpoint) {
            const snap = await dbQuery(`SELECT * FROM snapshots WHERE endpoint_id = '${this.endpoint.id}'`)
            let snapshot;
            // @ts-ignore
            const timestamp = Math.floor(new Date() / 1000)
            if (snap['length'] === 0 || snap[0].createdAt + 300 < timestamp) {
                const info = await this.service.info()
                const containers = await this.getContainers()
                const volumes = await this.getVolumes()
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
                    ImageCount: Object.keys(await this.getImages()).length,
                    ServiceCount: swarm.LocalNodeState === 'active' ? this.listServices().length : 0,
                    StackCount: 0,
                    Swarm: swarm.LocalNodeState === 'active',
                    Time: Math.floor(new Date(info.SystemTime).getTime() / 1000),
                    TotalCPU: info.NCPU,
                    TotalMemory: info.MemTotal,
                    VolumeCount: volumes ? volumes.Volumes.length : 0
                })
                if (snap['length'] > 0 && snap[0].createdAt + 300 < timestamp) {
                    await dbQuery(`UPDATE snapshots SET data = '${JSON.stringify(snapshot)}', createdAt = strftime('%s', 'now') WHERE endpoint_id = '${this.endpoint.id}'`)
                } else {
                    await dbQuery(`INSERT INTO snapshots (endpoint_id, data, createdAt) VALUES ('${this.endpoint.id}', '${JSON.stringify(snapshot)}', strftime('%s', 'now'))`)
                }


            } else {
                const data = JSON.parse(snap[0].data)
                snapshot = this.snapshot(data)
            }

            return getEndpoint({
                id: this.endpoint.id,
                name: this.endpoint.name,
                type: this.endpoint.type,
                groupId: this.endpoint.groupId,
                status: 1,
                publicURL: this.endpoint.public_url,
                url: this.endpoint.url,
                snapshot
            })
        } else {
            return false;
        }
    }

    public listNetworks() {
        return this.service.listNetworks()
    }

    public getNetwork(networkId) {
        return this.service.getNetwork(networkId)
    }

    public getImage(imageId) {
        return this.service.getImage(imageId)
    }

    public snapshot(data) {
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

    public listServices() {
        return this.service.listServices()
    }

    public getContainer(containerId) {
        return this.service.getContainer(containerId)
    }

    public async startContainer(containerId) {
        const container = await this.getContainer(containerId)
        if (container) {
            return container.start()
        } else {
            return false
        }
    }

    public async stopContainer(containerId) {
        const container = await this.getContainer(containerId)
        if (container) {
            return container.stop()
        } else {
            return false
        }
    }

    public async killContainer(containerId) {
        const container = await this.getContainer(containerId)
        if (container) {
            return container.kill()
        } else {
            return false
        }
    }

    public async restartContainer(containerId) {
        const container = await this.getContainer(containerId)
        if (container) {
            return container.restart()
        } else {
            return false
        }
    }

    public async pauseContainer(containerId) {
        const container = await this.getContainer(containerId)
        if (container) {
            return container.pause()
        } else {
            return false
        }
    }

    public async resumeContainer(containerId) {
        const container = await this.getContainer(containerId)
        if (container) {
            return container.unpause()
        } else {
            return false
        }
    }

    public async renameContainer(containerId, name) {
        const container = await this.getContainer(containerId)
        if (container) {
            return container.rename({name})
        } else {
            return false
        }
    }

    public async updateContainer(containerId, data) {
        const container = await this.getContainer(containerId)
        if (container) {
            return container.rename(data)
        } else {
            return false
        }
    }

    public getContainers() {
        return this.service.listContainers({all: 1}).then((containers) => {
            let arr = [];
            containers.forEach((item) => {
                arr.push(item)
            })
            return arr;
        }).catch(() => {
            return false
        })
    }

    public getVolumes() {
        return this.service.listVolumes({all: 1}).then((volumes) => {
            let arr = [];
            volumes.forEach((volume) => {
                arr.push(volume)
            })
            return arr;
        }).catch(() => {
            return false
        })
    }

    public getImages() {
        return new Promise((resolve, reject) => {
            this.service.listImages().then(data => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    public info() {
        return this.service.info()
    }

    public version() {
        return this.service.version()
    }

    public async test() {
        console.log(this.endpoint)
        // console.log(this.service.version())
        //  console.log(this.service)
    }

}

export default dockerService