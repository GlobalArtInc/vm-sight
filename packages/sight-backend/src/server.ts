import "dotenv-defaults/config";
import App from "./app";
import * as routes from "@routes";
import validateEnv from "@utils/validateEnv";
console.clear();

try {
  validateEnv();
  const app = new App();
  app.init(Object.keys(routes).map((name) => new routes[name]())).then(() => {
    app.listen();
  });
} catch (err) {
  console.error(err);
}
