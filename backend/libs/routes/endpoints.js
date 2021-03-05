var express = require('express');

var router = express.Router();
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
var Docker = require('dockerode');

router.use('/', authMiddleware)

router.get('/', (req, res) => {
    db.query('SELECT * FROM endpoints').then((endpoints) => {
        let arr = [];
        endpoints.forEach((i) => {
            if (i.type === 1) {
                let docker;
                if (i.url.match('unix:///var/run/docker.sock')) {
                    docker = new Docker({socketPath: '/var/run/docker.sock'});
                } else {
                    docker = new Docker({host: i.url, port: 2375});
                }

                arr.push({
                    id: i.id,
                    name: i.name,
                    type: i.type,
                    url: i.url,
                    status: docker.ping((err) => !err ? 0 : 1),
                    groupId: i.groupId
                })
            }
        })
        return res.send(arr)
    })
});

module.exports = router;