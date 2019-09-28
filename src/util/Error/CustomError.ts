import { Response } from 'express';

export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }

  public process(res: Response) {
    res.status(this.status).json(this.message);
  }
}
