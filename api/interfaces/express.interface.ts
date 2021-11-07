import {NextFunction, Request, Response} from "express"

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