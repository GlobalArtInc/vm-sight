import Controller from "../../interfaces/controller.interface";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import App from "../../app";
import {Router} from "express";
import {dbQuery} from "../../utils/DB";
import HttpException from "../../exceptions/HttpException";
import {getUserByIdAndCheckIfAdmin} from "../../models/user.model";
import authMiddleware from '../../middleware/auth.middleware'
import ForbiddenException from "../../exceptions/ForbiddenException";
import {cryptPassword, getGUID} from "../../utils/Security";

class UsersController extends App implements Controller {
    public path = '/users'
    public router = Router()

    constructor(...props) {
        super(props)
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware)
        this.router.post(this.path, authMiddleware)
        this.router.get(this.path + '/:id', authMiddleware)
        this.router.put(this.path + '/:id', authMiddleware)
        this.router.delete(this.path + '/:id', authMiddleware)

        this.router.get(this.path, async (req: IRequest, res: IResponse, next: INext) => {
            const access = await getUserByIdAndCheckIfAdmin(req.user.id);
            if (access) {
                const users = await dbQuery('SELECT id,username,role,createdAt,updatedAt FROM users')
                return res.send(users)
            } else {
                return next(new ForbiddenException)
            }
        })

        this.router.post(this.path, async (req: IRequest, res: IResponse, next: INext) => {
            const access = await getUserByIdAndCheckIfAdmin(req.user.id);
            if (access) {
                const {Username, Password, Role} = req.body
                if (!Username) return next(new HttpException(400, "Username is not specified"))
                if (!Password) return next(new HttpException(400, "Password is not specified"))
                if (Role < 0 || Role > 1) {
                    return next(new HttpException(400, "Role is not specified"))
                } else {
                    const user = await dbQuery(`SELECT username FROM users WHERE username = '${Username}'`)

                    // @ts-ignore
                    if (user.length > 0) {
                        return next(new HttpException(400, "User already exists"))
                    } else {
                        cryptPassword(Password).then((hash) => {
                            const id = getGUID()

                            dbQuery(`INSERT INTO users 
                                    (id, username, password, role, createdAt, updatedAt) VALUES
                                    ('${id}', '${Username}', '${hash}', ${Role}, strftime('%s', 'now'), strftime('%s', 'now'))`).then(() => {
                                return res.send({response: true})
                            })
                        })
                    }
                }
            } else {
                return next(new ForbiddenException)
            }
        })

        this.router.get(this.path + '/:id', async (req: IRequest, res: IResponse, next: INext) => {
            const access = await getUserByIdAndCheckIfAdmin(req.user.id);
            if (access) {
                const user = await dbQuery(`SELECT id,username,role,createdAt,updatedAt FROM users WHERE id = '${req.params.id}'`)
                if (user['length'] > 0) {
                    return res.send(user[0])
                } else {
                    return res.status(404).send({message: "User not found"})
                }
            } else {
                return next(new ForbiddenException)
            }
        })

        this.router.put(this.path + '/:id', async (req: IRequest, res: IResponse, next: INext) => {
            const access = await getUserByIdAndCheckIfAdmin(req.user.id);
            if (access) {
                const user = await dbQuery(`SELECT id,username,role FROM users WHERE id = '${req.params.id}'`)
                const {Username, Password, Role} = req.body

                if (user['length'] > 0) {
                    if (req.user.id === user[0].id && Role === 0) {
                        return next(new HttpException(403, "You can't remove yourself from administrator group"))
                    }
                    if (Username) {
                        const checkUser = await dbQuery(`SELECT username FROM users WHERE LOWER(username) = LOWER("${Username}")`)

                        if (checkUser['length'] > 0 && user[0].username !== Username) {
                            return next(new HttpException(403, "Username is already used"))
                        }
                        await dbQuery(`UPDATE users SET username = '${Username}' WHERE id = '${user[0].id}'`)
                    }

                    if (Password) {
                        if (Password.length < 4) {
                            return next(new HttpException(403, "Simple Password"))
                        }
                        const hash = Password ? await cryptPassword(Password) : ''
                        await dbQuery(`UPDATE users SET password = '${hash}' WHERE id = '${user[0].id}'`)
                    }
                    await dbQuery(`UPDATE users SET role = '${Role}' WHERE id = '${user[0].id}'`)

                    return res.send({status: 200, message: "The user has been updated"})
                } else {
                    return next(new HttpException(404, "User not found"))
                }
            } else {
                return next(new ForbiddenException)
            }

        })

        this.router.delete(this.path + '/:id', async (req: IRequest, res: IResponse, next: INext) => {
            const access = await getUserByIdAndCheckIfAdmin(req.user.id);
            if (access) {
                const user = await dbQuery(`SELECT id,username,role FROM users WHERE id = '${req.params.id}'`)

                // @ts-ignore
                if (user.length > 0) {
                    if (req.user.id === user[0].id) {
                        return next(new HttpException(403, "You can't delete yourself"))
                    } else {
                        dbQuery(`DELETE FROM users WHERE id = '${user[0].id}'`).then(() => {
                            return res.send({message: "User was deleted"})
                        }).catch((err) => {
                            return next(new HttpException(500, err))
                        })
                    }
                } else {
                    return next(new HttpException(404, "User not found"))
                }
            } else {
                return next(new ForbiddenException)
            }

        })

        this.router.post(this.path + '/admin/init', async (req: IRequest, res: IResponse, next: INext) => {
            dbQuery('SELECT COUNT(*) as count FROM users WHERE role = 1').then((r) => {
                if (r[0].count === 0) {
                    const {Username, Password} = req.body;
                    if (Username && Password) {
                        cryptPassword(Password).then((hash) => {
                            const id = getGUID()
                            dbQuery(`INSERT INTO users 
                                    (id, username, password, role, createdAt, updatedAt) VALUES
                                    ('${id}', '${Username}', '${hash}', 1, strftime('%s', 'now'), strftime('%s', 'now'))`).then(() => {
                                return res.send({response: true})
                            })
                        })
                    } else {
                        next(new HttpException(405, 'No username or password'))
                    }
                } else {
                    next(new ForbiddenException)
                }
            })

        })

        this.router.get(this.path + '/admin/check', (req: IRequest, res: IResponse, next: INext) => {
            dbQuery('SELECT COUNT(*) as count FROM users WHERE role = 1').then((r) => {
                if (r[0].count > 0) {
                    return res.send({response: true})
                } else {
                    return next(new HttpException(404, "No administrator account found inside the database"))
                }
            })

        })
    }
}

export default UsersController