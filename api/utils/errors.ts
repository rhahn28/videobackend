import { config } from '../../config';

export class NotFoundError extends Error {
  readonly name = NotFoundError.name
  readonly statusCode = 404;

  constructor(message: string = 'Not found') {
    super(message);
    if (!config.isLocal) {
      this.stack = message;
    }
  }
}