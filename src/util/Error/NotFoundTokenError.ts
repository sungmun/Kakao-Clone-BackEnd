import { CustomError } from './CustomError';

export class NotFoundTokenError extends CustomError {
  constructor() {
    super('not found token', 401);
  }
}
