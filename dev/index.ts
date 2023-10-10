import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import { handler } from "../src/index";

class DevelopServer {
  server: any;
  port: number = 3020;
  constructor() {
    this.server = express();
    this.server.use(bodyParser.json());
  }

  route() {
    this.server.post("/", async (req: any, res: any) => {
      const response: any = await handler(req /*, context*/);
      res.send(response);
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }

  static bootstrap() {
    const dev: any = new DevelopServer();
    dev.route();
    dev.start();
  }
}

DevelopServer.bootstrap();
