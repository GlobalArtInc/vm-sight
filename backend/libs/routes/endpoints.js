var express = require('express');
var passport = require('passport');
var router = express.Router();
const authMiddleware = require('../middlewares/auth')

router.use('/', authMiddleware)

router.get('/', function (req, res) {
    res.json({
        response: false,
        info: req.decoded
    });
});

module.exports = router;