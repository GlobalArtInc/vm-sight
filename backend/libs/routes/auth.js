var express = require('express');
var passport = require('passport');
const jwt = require('jsonwebtoken')
var router = express.Router();
const user = require('../models/user')
var log = require('../log')(module);

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
            const p = new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        id: r.id,
                        username: r.username,
                        role: r.role
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
                return res.send({err})
            })
            return p
        }).catch(() => {
            log.error('Login error')
            return res.send({msg: "Login error"})
        })
    } else {
        return res.status(405).send({response: false})
    }
});

module.exports = router;