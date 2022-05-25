import { NextFunction, Request, Response, Router } from 'express';
// import { WithWebsocket } from '@routes/websocket.route';

interface Route {
  path?: string;
  router: Router;
}

export interface IUser {
  id: string;
  username: string;
  role: number;
  createdAt: number;
  updatedAt: number;
}

export interface IRequest extends Request {
  user: IUser;
}

export type IResponse = Response;

export type INext = NextFunction;

export default Route;
