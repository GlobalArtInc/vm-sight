import {IRequest, IResponse, INext, IUser} from "../interfaces/express.interface";
import {verify as jwtVerify} from "jsonwebtoken";
import {dbQuery} from "../utils/DB";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import {jwtSecret} from "../constants";
import * as fs from "fs";

export default function (req: IRequest, res: IResponse, next: INext) {
    if (req.headers.authorization || req.query.token) {
        const token = req.headers.authorization ? req.headers.authorization.split('Bearer ') : req.query.token

        // token does not exist
        if (!token) {
            return next(new NotAuthorizedException)
        }

        // if it has failed to verify, it will return an error message
        const onError = () => {
            return next(new NotAuthorizedException)
        }

        // create a promise that decodes the token
        new Promise(
            (resolve, reject) => {
                jwtVerify(req.headers.authorization ? token[1] : token, fs.readFileSync(jwtSecret), (err: any, user: any) => {
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
        ).then((user: IUser) => {
            req.user = user
            next()
        }).catch(onError)
    } else {
        return next(new NotAuthorizedException)
    }
}