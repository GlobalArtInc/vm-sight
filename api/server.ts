import App from './app'
import MainController from "./controllers/main/main.controller";
import AuthController from "./controllers/auth/auth.controller";
import UsersController from './controllers/users/users.controller'
console.clear()
const app = new App([
    new MainController(),
    new AuthController(),
    new UsersController()
]);

app.listen()