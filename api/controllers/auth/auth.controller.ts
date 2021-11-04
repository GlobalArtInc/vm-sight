import {Router} from 'express';
import * as fs from 'fs';
import {INext, IRequest, IResponse, IUser} from '../../interfaces/express.interface';
import Controller from "../../interfaces/controller.interface";
import {findUser} from "../../models/user.model";
import App from "../../app";
import HttpException from "../../exceptions/HttpException";
import {jwtSecret} from "../../constants";
const jwt = require('jsonwebtoken')

class AuthController extends App implements Controller {
    public path = '/auth'
    public router = Router()

    constructor(...props) {
        super(props);
        this.router.post(this.path, (req: IRequest, res: IResponse, next: INext) => {
            const {Username, Password} = req.body;

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

        })
    }
}

export default AuthController