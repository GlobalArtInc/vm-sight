import {Router} from 'express';
import * as fs from 'fs';
import {INext, IRequest, IResponse, IUser} from '../../interfaces/express.interface';
import Controller from "../../interfaces/controller.interface";
import {findUser} from "../../models/user.model";
import App from "../../app";
import HttpException from "../../exceptions/HttpException";
import {jwtSecret} from "../../constants";
import {getSetting} from "../../utils/Global";
import {dbQuery} from "../../utils/DB";
import axios from 'axios'
import NotAuthorizedException from "../../exceptions/NotAuthorizedException";

const jwt = require('jsonwebtoken')

class AuthController extends App implements Controller {
    public path = '/auth'
    public router = Router()

    constructor(...props) {
        super(props);
        this.router.post('/', async (req: IRequest, res: IResponse, next: INext) => {
            const {Username, Password, Code} = req.body;

            if (Code) {
                const settings = await dbQuery('SELECT * FROM settings')
                const AuthenticationMethod = getSetting(settings, 'AuthenticationMethod', 1)
                if (AuthenticationMethod === 3) {
                    const AccessTokenURI = getSetting(settings, 'AccessTokenURI', ""),
                        ClientID = getSetting(settings, 'ClientID', ""),
                        ResourceURI = getSetting(settings, 'ResourceURI', ""),
                        RedirectURI = getSetting(settings, 'RedirectURI', ""),
                        ClientSecret = getSetting(settings, 'ClientSecret', "")

                    try {
                        const access = await axios.post(AccessTokenURI, {
                            client_id: ClientID,
                            code: Code,
                            redirect_uri: RedirectURI,
                            client_secret: ClientSecret
                        })
                        if (access.data['access_token']) {
                            axios.get(ResourceURI, {
                                headers: {
                                    Authorization: "Bearer " + access.data['access_token']
                                }
                            }).then((res) => res.data).then(async (user) => {
                                const users_external = await dbQuery(`SELECT * FROM users_external WHERE identity = '${user.id}'`)
                                if (users_external['length'] > 0) {
                                    const user = await dbQuery(`SELECT * FROM users WHERE id = '${users_external[0].user_id}'`)
                                    if (user['length'] > 0) {
                                        return new Promise((resolve, reject) => {
                                            jwt.sign(
                                                {
                                                    id: user[0].id
                                                },
                                                fs.readFileSync(jwtSecret), {
                                                    expiresIn: '365d', subject: 'userInfo'
                                                }, (err, token) => {
                                                    if (err) reject(err)
                                                    resolve(token)
                                                })
                                        }).then((jwt) => {
                                            return res.send({jwt})
                                        }).catch((err) => {
                                            return next(new HttpException(401, err))
                                        })
                                    } else {
                                        return next(new NotAuthorizedException())
                                    }
                                } else {
                                    return next(new NotAuthorizedException())
                                }
                            }).catch(() => {
                                return next(new NotAuthorizedException())
                            })
                        } else {
                            return next(new NotAuthorizedException())
                        }
                    } catch (err) {
                        return next(new HttpException(err.status, err.message))
                    }
                } else {
                    return next(new HttpException(403, 'NoAuthenticationMethod'))
                }
            } else {
                findUser(Username, Password).then((user: IUser) => {
                    return new Promise((resolve, reject) => {
                        jwt.sign(
                            {
                                id: user.id
                            },
                            fs.readFileSync(jwtSecret), {
                                expiresIn: '365d', subject: 'userInfo'
                            }, (err, token) => {
                                if (err) reject(err)
                                resolve(token)
                            })
                    }).then((jwt) => {
                        return res.send({jwt})
                    }).catch((err) => {
                        return next(new HttpException(401, err))
                    })
                }).catch(() => {
                    return next(new HttpException(401, 'Login Error'))
                })
            }

        })
    }
}

export default AuthController