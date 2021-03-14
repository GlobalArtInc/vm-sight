const express = require('express');
const db = require('../db')
const router = express.Router();
const authMiddleware = require('../middlewares/auth')

router.use('/motd', authMiddleware)
router.use('dockerhub', authMiddleware)
router.use('/me', authMiddleware)

router.get('/', function (req, res) {
    res.json({
        response: false
    });
});

router.get('/me', (req, res) => {
    db.query(`SELECT * FROM users WHERE id = '${req.user.id}'`).then((user) => {
        if (user.length > 0) {
            return res.status(200).send({
                id: user[0].id,
                username: user[0].username,
                role: user[0].role,
                createdAt: user[0].createdAt,
                updatedAt: user[0].updatedAt
            })
        }
    })
})

router.get('/motd', (req, res) => {
    return res.json({
        response: true
    })
})

router.get('/dockerhub', async (req, res) => {
    let dockerHubAPI = require('docker-hub-api');
    const dockerhub = await db.query(`SELECT id, name, login, password FROM registries WHERE id = 'dockerhub'`)
    if (dockerhub.length > 0) {
        dockerHubAPI.login(dockerhub[0].login, dockerhub[0].password).then(() => {
            return res.send({
                Authentication: true,
                Username: dockerhub[0].login
            })
        }).catch(() => {
            return res.status(403).send({
                Authentication: false,
                Username: null
            })
        })
    } else {
        await db.query(`INSERT OR IGNORE INTO registries (id, user_id, type, name, createdAt)
        VALUES ('dockerhub', '0', 'dockerhub', 'DockerHub', strftime('%s', 'now'))`)

        return res.status(403).send({
            Authentication: false,
            Username: null
        })
    }
})

router.post('/dockerhub', async (req, res) => {
    const dockerhub = await db.query(`SELECT id, name, login, password FROM registries WHERE id = 'dockerhub'`)
    if (dockerhub.length > 0) {
        const {Authentication, Username, Password} = req.body
        if (Authentication === 1) {
            let dockerHubAPI = require('docker-hub-api');
            dockerHubAPI.login(Username, Password).then(async () => {
                await db.query(`UPDATE registries SET login = '${Username}', password = '${Password}' WHERE id = 'dockerhub'`)
                return res.send({
                    Authentication: true,
                    Username
                })
            }).catch(async () => {
                await db.query(`UPDATE registries SET login = null, password = null WHERE id = 'dockerhub'`)
                return res.status(403).send({Authentication: false})
            })
        } else if(Authentication === 0) {
            await db.query(`UPDATE registries SET login = null, password = null WHERE id = 'dockerhub'`)
            return res.send({response: true})
        } else {
            return res.status(400).send('')
        }
    } else {
        return res.send({response: false})
    }
})

router.get('/version', (req, res) => {
    return res.send({Version: "1.0"})
})

module.exports = router;
