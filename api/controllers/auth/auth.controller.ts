import {Router} from 'express';
import {IRequest, IResponse} from '../../interfaces/express.interface';
import Controller from "../../interfaces/controller.interface";
import authMiddleware from "../../middleware/auth.middleware";
import {findUser} from "../../models/user.model";
import App from "../../app";
const jwt = require('jsonwebtoken')

class AuthController extends App implements Controller {
    public path = '/auth'
    public router = Router()

    constructor(...props) {
        super(props);
        this.router.post(this.path, (req: IRequest, res: IResponse) => {
            const {Username, Password} = req.body;
            const secret = req.app.get('jwt-secret')

            findUser(Username, Password).then((r) => {
                return new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            // @ts-ignore
                            id: r.id
                        },
                        secret, {
                            expiresIn: '365d', subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        })
                }).then((jwt) => {
                    return res.send({jwt})
                }).catch((err) => {
                    console.log(err)
                    return res.status(401).send({message: String(err)})
                })
            }).catch(() => {
                return res.status(401).send({message: "Login error"})
            })

        })
    }
}

export default AuthController