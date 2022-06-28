import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as swaggerJsdoc from 'swagger-jsdoc';

const app: Application = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(awsServerlessExpressMiddleware.eventContext());

// error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.log('Error: ', err);
  res.status(err.statusCode || 500).send({
    message: err.message || 'Unhandled Error',
  });
});
export default app;
