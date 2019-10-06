import { CustomError } from './CustomError';

export class NotFoundDataBaseDataError extends CustomError {
  constructor() {
    super('not found DataBase data', 401);
  }
}
