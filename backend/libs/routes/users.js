const express = require('express');
const router = express.Router();
const db = require('../../libs/db')
const global = require('../global')
const user = require('../models/user')

const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware)
router.post('/', authMiddleware)
router.get('/:id', authMiddleware)
router.post('/:id', authMiddleware)
router.put('/:id', authMiddleware)
router.delete('/:id', authMiddleware)

// router.get('/admin/check', authMiddleware)

router.get('/', async (req, res) => {
    const access = await user.getUserByIdAndCheckIfAdmin(req.user.id);
    if (access) {
        const users = await db.query('SELECT id,username,role,createdAt,updatedAt FROM users')
        return res.send(users)
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.post('/', async (req, res) => {
    const access = await user.getUserByIdAndCheckIfAdmin(req.user.id);
    if (access) {
        const {Username, Password, Role} = req.body
        if (!Username) return res.status(400).send({message: "Username is not specified"})
        if (!Password) return res.status(400).send({message: "Password is not specified"})
        if (Role < 0 || Role > 1) {
            return res.status(400).send({message: "Role is not specified"})
        } else {
            const user = await db.query(`SELECT username FROM users WHERE username = '${Username}'`)
            if (user.length > 0) {
                return res.status(403).send({message: "User already exists"})
            } else {
                global.cryptPassword(Password).then((hash) => {
                    const id = global.getGUID()

                    db.query(`INSERT INTO users 
                                    (id, username, password, role, createdAt, updatedAt) VALUES
                                    ('${id}', '${Username}', '${hash}', ${Role}, strftime('%s', 'now'), strftime('%s', 'now'))`).then(() => {
                        return res.send({response: true})
                    })
                })
            }
        }
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.get('/:id', async (req, res) => {
    const access = await user.getUserByIdAndCheckIfAdmin(req.user.id);
    if (access) {
        const user = await db.query(`SELECT id,username,role,createdAt,updatedAt FROM users WHERE id = '${req.params.id}'`)
        if (user.length > 0) {
            return res.send(user[0])
        } else {
            return res.status(404).send({message: "User not found"})
        }
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.put('/:id', async (req, res) => {
    const access = await user.getUserByIdAndCheckIfAdmin(req.user.id);
    if (access) {
        const user = await db.query(`SELECT id,username,role FROM users WHERE id = '${req.params.id}'`)
        const {Username, Password, Role} = req.body

        if (user.length > 0) {
            if (req.user.id === user[0].id && Role === 0) {
                return res.status(403).send({message: "You can't remove yourself from administrators"})
            }
            if (Username) {
                const checkUser = await db.query(`SELECT username FROM users WHERE LOWER(username) = LOWER("${Username}")`)
                const currentUser = await db.query(`SELECT username FROM users WHERE id = '${req.user.id}'`);

                if (checkUser.length > 0 && req.user.id && currentUser[0].username !== Username) {
                    return res.status(403).send({message: "Username is already used"})
                }
            }

            if (Password) {
                if (Password.length < 4) {
                    return res.status(403).send({message: "Simple Password"})
                }
            }

            const hash = Password ? await global.cryptPassword(Password) : ''

            const query = `UPDATE users SET ${Username ? "username='" + Username + "'" : ''}${Password ? ", password='" + hash + "'" : ""}${Role ? ", role=" + Role : "role=" + Role} WHERE id = '${user[0].id}'`
            db.query(query).then(() => {
                return res.send({response: true})
            }).catch(() => {
                return res.status(403).send({response: false})
            })
        } else {
            return res.status(404).send({message: "User not found"})
        }
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.delete('/:id', async (req, res) => {
    const access = await user.getUserByIdAndCheckIfAdmin(req.user.id);
    if (access) {
        const user = await db.query(`SELECT id,username,role FROM users WHERE id = '${req.params.id}'`)

        if (user.length > 0) {
            if (req.user.id === user[0].id) {
                return res.status(403).send({message: "You can't delete yourself"})
            } else {
                db.query(`DELETE FROM users WHERE id = '${user[0].id}'`).then(() => {
                    return res.send({message: 'User was deleted'})
                }).catch((err) => {
                    return res.status(500).send(err)
                })
            }
        } else {
            return res.status(404).send({message: "User not found"})
        }
    } else {
        return res.status(403).send({message: "Forbidden"})
    }
})

router.post('/admin/init', async function (req, res) {
    db.query('SELECT COUNT(*) as count FROM users WHERE role = 1').then((r) => {
        if (r[0].count === 0) {
            const {Username, Password} = req.body;
            if (Username && Password) {
                global.cryptPassword(Password).then((hash) => {
                    const id = global.getGUID()
                    console.log(hash)
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
