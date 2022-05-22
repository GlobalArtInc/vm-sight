import {NextFunction, Request, Response, Router} from "express"

interface Route {
    path?: string,
    router: Router
}

export interface IUser {
    id: string,
    username: string,
    role: number,
    createdAt: number,
    updatedAt: number
}

export interface IRequest extends Request {
    user: IUser
}

export interface IResponse extends Response {

}

export interface INext extends NextFunction {

}

export default Route;
