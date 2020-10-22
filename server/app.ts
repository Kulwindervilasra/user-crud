import express, { Application, Request, Response } from 'express';
import { Environment } from "./utils";
import { connect, connection } from 'mongoose';
import { createServer, Server } from "http";
import controllers from './controllers';
import middleWares from './middleware';



class App {
  public app: Application;
  public port: number | string;
  private server: Server;
  constructor() {
    this.app = express();
    this.port = Environment.PORT;
    this.server = createServer(this.app);
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).send({ message: "Server is running" });
    });
    middleWares(this.app);
    this.routes();
  }

  private routes() {
    controllers.forEach(controller => {
      this.app.use('/api', controller.router);
    });
  }

  private connectToDB() {
    connect(Environment.MONGOURL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    connection.on('open', () => {
      console.log('Connected to Database successfully.');
    });
    connection.on('error', (err: any) => {
      console.log(err);
    });
  }

  public listen() {
    this.server.listen(this.port, async () => {
      console.log(`App listening on the http://localhost:${this.port}`);
      this.connectToDB();
    });
  }
}
export default App;