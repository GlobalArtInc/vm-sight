const express = require('express');
const router = express.Router();
const db = require('../../libs/db')
const global = require('../global')

router.post('/admin/init', async function (req, res) {
    db.query('SELECT COUNT(*) as count FROM users WHERE role = 1').then((r) => {
        if (r[0].count === 0) {
            const {Username, Password} = req.body;
            if (Username && Password) {
                global.cryptPassword(Password, (err, hash) => {
                    const id = global.getGUID()

                    db.query(`INSERT INTO users 
                                    (id, username, password, role, createdAt, updatedAt) VALUES
                                    ('${id}', '${Username}', '${hash}', 1, strftime('%s', 'now'), strftime('%s', 'now'))`).then(() => {
                        return res.send({response: true})
                    })
                })
            } else {
                return res.status(405).send({response: false})
            }
        } else {
            return res.status(403).send({response: false})
        }
    })
});

router.get('/admin/check', (req, res) => {
    db.query('SELECT COUNT(*) as count FROM users WHERE role = 1').then((r) => {
        if (r[0].count > 0) {
            return res.send({response: true})
        } else {
            return res.status(404).send({
                "message": "No administrator account found inside the database",
                "details": "Object not found inside the database"
            })
        }
    })
})

module.exports = router;