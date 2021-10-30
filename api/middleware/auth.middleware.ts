import {IRequest, IResponse, INext} from "../interfaces/express.interface";
import {verify as jwtVerify} from "jsonwebtoken";
import {dbQuery} from "../utils/DB";

export default function (req: IRequest, res: IResponse, next: INext) {
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
                jwtVerify(token[1], req.app.get('jwt-secret'), (err: any, user: any) => {
                    if (err) reject(err)
                    dbQuery(`SELECT * FROM users WHERE id = '${user.id}'`).then((u: any) => {
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
        const onError = (error: any) => {
            res.status(401).json({
                message: "Unauthorized",
                details: "Unauthorized"
            })
        }

        // process the promise
        p.then((user) => {
            // @ts-ignore
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