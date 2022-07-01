import { config } from '../../config';

export class BadRequestError extends Error {
  readonly name = BadRequestError.name
  readonly statusCode = 400;

  constructor(message: string = 'Bad Request') {
    super(message);
    if (!config.isLocal) {
      this.stack = message;
    }
  }
}

export class UnauthorizedError extends Error {
  readonly name = UnauthorizedError.name
  readonly statusCode = 401;

  constructor(message: string = 'Unauthorized') {
    super(message);
    if (!config.isLocal) {
      this.stack = message;
    }
  }
}

export class ForbiddenError extends Error {
  readonly name = ForbiddenError.name
  readonly statusCode = 403;

  constructor(message: string = 'Forbidden') {
    super(message);
    if (!config.isLocal) {
      this.stack = message;
    }
  }
}

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
