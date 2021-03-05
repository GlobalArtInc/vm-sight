const jwt = require('jsonwebtoken')
const db = require('../db')

const authMiddleware = (req, res, next) => {
    // read the token from header or url
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')

        // token does not exist
        if (!token) {
            res.status(401).json({
                message: "Unauthorized",
                details: "Unauthorized"
            })
        }

        // create a promise that decodes the token
        const p = new Promise(
            (resolve, reject) => {
                jwt.verify(token[1], req.app.get('jwt-secret'), (err, user) => {
                    if (err) reject(err)
                    db.query(`SELECT * FROM users WHERE id = '${user.id}'`).then((u) => {
                        if (u.length > 0) {
                            resolve(u[0])
                        } else {
                            reject('Unauthorized')
                        }
                    })
                })
            }
        )

        // if it has failed to verify, it will return an error message
        const onError = (error) => {
            res.status(401).json({
                message: "Unauthorized",
                details: "Unauthorized"
            })
        }

        // process the promise
        p.then((user) => {
            req.user = user
            next()
        }).catch(onError)
    } else {
        return res.status(401).json({
            message: "Unauthorized",
            details: "Unauthorized"
        })
    }
}

module.exports = authMiddleware