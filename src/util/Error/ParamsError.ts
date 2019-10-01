import { CustomError } from './CustomError';
export class ParamsError extends CustomError {
  constructor() {
    super('파라미터 값이 올바르지 않습니다', 403);
  }
}
