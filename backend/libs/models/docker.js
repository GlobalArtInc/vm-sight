module.exports.getPing = async(docker) => {
    if (await docker.ping()) {
        console.log(2)
    }
}