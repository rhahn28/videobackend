import { RequestHandler } from 'express';

export type Route = {
  path: string;
  method: string;
  middleware?: RequestHandler;
  handler: RequestHandler;
};

export interface IDecodedUser {
  scope: string,
  username: string,
  sub: string;
  event_id: string;
  token_use: 'access';
  client_id: string;
  auth_time: number;
  origin_jti: string;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
}
