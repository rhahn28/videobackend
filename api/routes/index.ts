import { Route } from '../interfaces/request';
import { ForbiddenError } from '../utils/errors';
import assetRouter from './assetRouter';

export const routes: Route[] = [
  {
    path: '/',
    method: 'get',
    handler: (req, res, next) => {
      next(new ForbiddenError());
    },
  },
  {
    /**
     * @openapi
     * /ping:
     *   get:
     *     tags:
     *       - Ping
     *     description: Ping endpoint for seeing that.
     *     responses:
     *       200:
     *         description: Returns an API Gateway event.
     */
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
