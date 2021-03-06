const db = require('../db')
const Docker = require('dockerode')
const fs = require('fs')

module.exports.connect = (id) => {
    return db.query(`SELECT * FROM endpoints WHERE id = '${id}'`).then((endpoint) => {
        if (endpoint.length > 0) {
            let settings = (endpoint[0].url.match('unix:///var/run/docker.sock')) ?
                {socketPath: '/var/run/docker.sock'} : {
                    host: endpoint[0].url.split(':')[0],
                    port: endpoint[0].url.split(':')[1]
                };
            if (endpoint[0].tls === 1) {
                if (endpoint[0].tls_ca === 1) {
                    const file = `./data/certs/${endpoint[0].id}/ca.pem`
                    if (fs.existsSync(file)) {
                        settings.ca = fs.readFileSync(file)
                    }
                }
                if (endpoint[0].tls_cert === 1) {
                    const file = `./data/certs/${endpoint[0].id}/cert.pem`
                    if (fs.existsSync(file)) {
                        settings.cert = fs.readFileSync(file)
                    }
                }
                if (endpoint[0].tls_key === 1) {
                    const file = `./data/certs/${endpoint[0].id}/key.pem`
                    if (fs.existsSync(file)) {
                        settings.key = fs.readFileSync(file)
                    }
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

module.exports.getEndpoint = (endpoint, docker) => {
    return docker.version().then(async () => {
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

       // containers[0].map(containers => {
       //  // console.log(containers)
       // })

        const timestamp = Math.floor(new Date()/1000)

        const snapshot = {
            DockerVersion: info.ServerVersion,
            RunningContainerCount: info.ContainersRunning,
            StoppedContainerCount: info.ContainersStopped,
            HealthyContainerCount: healthy.length,
            UnhealthyContainerCount: unhealthy.length,
            ImageCount: info.Images,
            ServiceCount: swarm.LocalNodeState === 'active' ? await docker.listServices().length : 0,
            StackCount: 0,
            Swarm: swarm.LocalNodeState === 'active',
            Time: Math.floor(new Date(info.SystemTime).getTime()/1000),
            TotalCPU: info.NCPU,
            TotalMemory: info.MemTotal,
            VolumeCount: volumes.Volumes.length
        }

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
            url: endpoint.url
        })
    })
}

module.exports.getVersion = async (docker) => {
    return await docker.version()
}

module.exports.getInfo = async (docker) => {
    return await docker.info()
}

module.exports.getContainers = async (docker) => {
    return await docker.listContainers()
}
