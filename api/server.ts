import App from './app'
import MainController from "./controllers/main/main.controller";
import AuthController from "./controllers/auth/auth.controller";
console.clear()
const app = new App([
    new MainController(),
    new AuthController()
]);

app.listen()