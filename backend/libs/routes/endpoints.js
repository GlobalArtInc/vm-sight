var express = require('express');

var router = express.Router();
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
var Docker = require('dockerode');

router.use('/', authMiddleware)

router.get('/', (req, res) => {
    db.query('SELECT * FROM endpoints').then((endpoints) => {
        const promises = endpoints
            .map((i) => {
                // DOCKER
                if (i.type === 1) {
                    const result = {
                        id: i.id,
                        name: i.name,
                        type: i.type,
                        url: i.url,
                        groupId: i.groupId
                    };

                    const settings = (i.url.match('unix:///var/run/docker.sock')) ?
                        {socketPath: '/var/run/docker.sock'} : {host: i.url, port: 65000};
                    const docker = new Docker(settings);

                    return docker.ping().then(err => {
                        result.status = 1
                        return result;
                    }).catch((err) => {
                        result.status = 0;
                        return result
                    })
                } else if(i.type === 2) {
                    // KUBERNETES
                }
            });

        Promise.all(promises).then((results) => res.send(results))
    })
});

module.exports = router;