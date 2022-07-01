import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as swaggerJsdoc from 'swagger-jsdoc';
import { routes } from './routes';
import { NotFoundError } from './utils/errors';
import { swaggerHTML, swaggerOptions } from './swaggerConfig';
import { config } from '../config';

const app: Application = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(awsServerlessExpressMiddleware.eventContext());

for (const route of routes) {
  const { method, path, middleware, handler } = route;
  app[method](path, ...(middleware ? [middleware, handler] : [handler]));
}

app.use(config.swagger.path, (req, res) => {
  const host = `${config.isLocal ? `http` : `https`}://${req.headers.host}`;
  res.send(JSON.stringify(swaggerJsdoc(swaggerOptions(host))));
});
app.use(config.swagger.docsPath, (req, res) => {
  res.send(swaggerHTML);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new NotFoundError('Endpoint not found'));
});

// error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.log('Error: ', err);
  res.status(err.statusCode || 500).send({
    message: err.message || 'Unhandled Error',
  });
});
export default app;
