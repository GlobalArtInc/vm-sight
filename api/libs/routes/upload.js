const express = require('express');
const db = require('../db')
const router = express.Router();
const authMiddleware = require('../middlewares/auth')
const tls = require('./upload/tls')

router.use('/', authMiddleware)
router.use('/tls', tls)

router.get('/', (req, res) => {
    res.json({
        response: false
    });
});

module.exports = router;
