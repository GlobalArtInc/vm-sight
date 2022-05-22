import {IRequest, IResponse, INext, IUser} from "@interfaces/routes.interface";
import {verify as jwtVerify} from "jsonwebtoken";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import {jwtSecret} from "../constants";
import * as fs from "fs";
import {UsersModel} from "../models";

export default async function (req: IRequest, res: IResponse, next: INext) {
    const token = req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] :
        req.cookies.token ? req.cookies.token :
            req.query.token ?? false

    if (token) {
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
                jwtVerify(token, fs.readFileSync(jwtSecret), async (err: any, data) => {
                    if (err) return reject(err)
                    if (!data) return reject('Unauthorized')
                    const user = await UsersModel.findOne({where: {id: data.id}});

                    if (user) {
                        resolve(user);
                    } else {
                        reject('Unauthorized')
                    }
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
