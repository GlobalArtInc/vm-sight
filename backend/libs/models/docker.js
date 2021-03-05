const Docker = require('dockerode')

module.exports.connect = (endpoint) => {
    const settings = (endpoint.url.match('unix:///var/run/docker.sock')) ?
        {socketPath: '/var/run/docker.sock'} : {
            host: endpoint.url.split(':')[0],
            port: endpoint.url.split(':')[1]
        };
    return new Docker(settings);

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