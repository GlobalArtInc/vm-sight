import App from './app'
import MainController from "./controllers/main/main.controller";
import AuthController from "./controllers/auth/auth.controller";
import UsersController from './controllers/users/users.controller'
import EndpointsController from './controllers/endpoints/endpoints.controller'
import UploadController from './controllers/upload/upload.controller'
import WebSocketController from './controllers/websocket/websocket.controller'
console.clear()
const app = new App([
    new MainController(),
    new AuthController(),
    new UsersController(),
    new EndpointsController(),
    new UploadController(),
    new WebSocketController()
]);

app.listen()