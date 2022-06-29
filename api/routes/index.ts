import { Route } from '../interfaces/request';
import assetRouter from './assetRouter';

export const routes: Route[] = [
  {
    path: '/',
    method: 'get',
    handler: (req, res, next) => {

    },
  },
  {
    path: '/ping',
    method: 'get',
    handler: (req, res) => {
      res.send(req.apiGateway.event);
    },
  },
  {
    path: '/assets',
    method: 'use',
    handler: assetRouter,
  },
];
