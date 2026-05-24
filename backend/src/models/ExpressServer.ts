import express, { type Application, type RequestHandler, Router } from "express";

export default class ExpressServer {
  private app: Application;
  private port: string;

  constructor(port?: string) {
    this.app = express();
    this.port = port || process.env.SERVER_PORT || "8080";
  }

  setStaticPath(path: string = "public") {
    this.app.use(express.static(path));
  }

  setMiddleware(middleware: RequestHandler) {
    this.app.use(middleware);
  }

  setMiddlewares(middlewares: RequestHandler[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  setRoute(path: string, router: Router) {
    this.app.use(path, router);
  }

  setRoutes(routes: { path: string; router: Router }[]) {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running in port ${this.port}`);
    });
  }
}
