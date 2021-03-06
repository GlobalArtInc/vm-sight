const db = require('../db')
const Docker = require('dockerode')

module.exports.connect = (id) => {
    return db.query(`SELECT * FROM endpoints WHERE id = '${id}'`).then((endpoint) => {
        if (endpoint.length > 0) {
            const settings = (endpoint[0].url.match('unix:///var/run/docker.sock')) ?
                {socketPath: '/var/run/docker.sock'} : {
                    host: endpoint[0].url.split(':')[0],
                    port: endpoint[0].url.split(':')[1]
                };
            return {endpoint: endpoint[0], service: new Docker(settings)};
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
    return docker.version().then(async (version) => {
        const info = await docker.info()
        let dev;
        const volumes = await docker.listVolumes()
        console.log(info)
        const swarm = info.Swarm

        const snapshot = {
            DockerVersion: info.ServerVersion,
            RunningContainerCount: info.ContainersRunning,
            StoppedContainerCount: info.ContainersStopped,
            HealthyContainerCount: 0,
            ImageCount: info.Images,
            ServiceCount: swarm.LocalNodeState === 'active' ? await docker.listServices().length : 0,
            StackCount: 0,
            Swarm: swarm.LocalNodeState === 'active',
            Time: Math.floor(new Date(info.SystemTime).getTime()/1000),
            TotalCPU: info.NCPU,
            TotalMemory: info.MemTotal,
            VolumeCount: volumes.Volumes.length
        }
        // const services = await docker.listServices()
        // console.log(services)


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