import "module-alias/register";
import App from "./app";
import * as routes from "./routes";
console.clear();

try {
  const app = new App();
  app.init(Object.keys(routes).map((name) => new routes[name]())).then(() => {
    app.listen();
  });
} catch (err) {
  console.error(err);
}
