const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const user = require('../models/user')
const log = require('../log')(module);

/*
    POST /api/auth
    {
        username,
        password
    }
*/

router.post('/', function (req, res) {
    const {Username, Password} = req.body;
    const secret = req.app.get('jwt-secret')

    if (Username && Password) {
        user.findUser(Username, Password).then((r) => {
            return new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        id: r.id
                    },
                    secret,
                    {
                        expiresIn: '365d',
                        subject: 'userInfo'
                    }, (err, token) => {
                        if (err) reject(err)
                        resolve(token)
                    })
            }).then((jwt) => {
                return res.send({jwt})
            }).catch((err) => {
                log.error(String(err))
                return res.send({msg: String(err)})
            })
        }).catch(() => {
            log.error('Login error')
            return res.send({msg: "Login error"})
        })
    } else {
        return res.status(405).send({response: false})
    }
});

module.exports = router;