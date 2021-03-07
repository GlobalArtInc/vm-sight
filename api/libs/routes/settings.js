const express = require('express');
const router = express.Router();
const db = require('../../libs/db')
const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware)

router.get('/', async (req, res) => {
    const LogoURL = await db.query(`SELECT * FROM settings WHERE key = 'LogoURL'`)
    const AuthenticationMethod = await db.query(`SELECT * FROM settings WHERE key = 'AuthenticationMethod'`)

    const OAuthClientID = await db.query(`SELECT * FROM settings WHERE key = 'OAuthClientID'`)
    const OAuthRedirectURL = await db.query(`SELECT * FROM settings WHERE key = 'OAuthRedirectURL'`)

    return res.send({
        "LogoURL": LogoURL[0].value,
        "AuthenticationMethod": Number(AuthenticationMethod[0].value),
        "OAuthLoginURI": `?response_type=code&client_id=${OAuthClientID[0].value}&redirect_uri=${OAuthRedirectURL[0].value}&scope=&prompt=login`
    });
})

router.get('/public', async function (req, res) {
    const LogoURL = await db.query(`SELECT * FROM settings WHERE key = 'LogoURL'`)
    const AuthenticationMethod = await db.query(`SELECT * FROM settings WHERE key = 'AuthenticationMethod'`)

    const OAuthClientID = await db.query(`SELECT * FROM settings WHERE key = 'OAuthClientID'`)
    const OAuthRedirectURL = await db.query(`SELECT * FROM settings WHERE key = 'OAuthRedirectURL'`)

    return res.send({
        "LogoURL": LogoURL[0].value,
        "AuthenticationMethod": Number(AuthenticationMethod[0].value),
        "OAuthLoginURI": `?response_type=code&client_id=${OAuthClientID[0].value}&redirect_uri=${OAuthRedirectURL[0].value}&scope=&prompt=login`
    });
});

module.exports = router;