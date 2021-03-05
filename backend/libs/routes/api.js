const express = require('express');
const db = require('../db')
const router = express.Router();
const authMiddleware = require('../middlewares/auth')

router.use('/motd', authMiddleware)
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

router.get('/version', (req, res) => {
    return res.send({Version: "1.0"})
})

module.exports = router;