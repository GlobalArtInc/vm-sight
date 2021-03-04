var express = require('express');
var passport = require('passport');
var router = express.Router();
const authMiddleware = require('../middlewares/auth')

router.use('/motd', authMiddleware)

router.get('/', function (req, res) {
    res.json({
        response: false
    });
});

router.get('/motd', (req, res) => {
    return res.json({
        success: true,
        info: req.decoded
    })
})

router.get('/version', (req, res) => {
    return res.send({Version: "1.0"})
})

module.exports = router;