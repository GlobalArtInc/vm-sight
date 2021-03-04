const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    // read the token from header or url
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')

        // token does not exist
        if (!token) {
            res.status(403).json({
                message: "Unauthorized",
                details: "Unauthorized"
            })
        }

        // create a promise that decodes the token
        const p = new Promise(
            (resolve, reject) => {
                jwt.verify(token[1], req.app.get('jwt-secret'), (err, user) => {
                    if (err) reject(err)
                    resolve(user)
                })
            }
        )

        // if it has failed to verify, it will return an error message
        const onError = (error) => {
            res.status(403).json({
                message: "Unauthorized",
                details: "Unauthorized"
            })
        }

        // process the promise
        p.then((decoded) => {
            req.decoded = decoded
            next()
        }).catch(onError)
    } else {
        return res.status(403).json({
            message: "Unauthorized",
            details: "Unauthorized"
        })
    }
}

module.exports = authMiddleware