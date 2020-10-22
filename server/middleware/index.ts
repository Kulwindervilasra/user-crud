import { Application } from 'express';
import cors from 'cors';
import * as bodyParser from "body-parser";
import { checkToken } from "./authentication"

export default (app: Application) => {
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors())
  // app.use(cors({
  //   preflightContinue: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', "OPTIONS"],
  //   allowedHeaders: ['authorization', 'content-type'],
  //   exposedHeaders: ['Content-Disposition']
  // }));
  app.use(checkToken);
};

