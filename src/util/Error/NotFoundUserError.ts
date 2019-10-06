import { CustomError } from './CustomError';

export class NotFoundUserError extends CustomError {
  constructor() {
    super('user not found', 402);
  }
}
