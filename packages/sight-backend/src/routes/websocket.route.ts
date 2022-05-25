import Route from '@interfaces/routes.interface';
import express, { Router } from 'express';
import { ForbiddenException } from '@exceptions';
import { wrapRouteHandler } from '@utils/util';
import WebsocketController from '@controllers/websocket.controller';
import WebSocket from 'ws';

/* TO DO
interface WithWebsocket extends express.Router {
  ws: WebSocket;
}
*/

class WebsocketRoute implements Route {
  public path = '/websocket';
  public router = Router();
  public websocketController = new WebsocketController();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter() {
    require('express-ws')(this.router);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.router.ws('/attach', async (ws, req) => {
      return this.websocketController.attach(ws, req);
    });

    this.router.get(
      '*',
      wrapRouteHandler(async () => {
        throw new ForbiddenException('Only websocket connections');
      }),
    );
  }
}

export default WebsocketRoute;
