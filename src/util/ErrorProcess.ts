import { CustomError } from './Error/CustomError';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ErrorRequestHandler } from 'express-serve-static-core';

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  next,
) => {
  if (err instanceof CustomError) err.process(res);
  else if (err instanceof JsonWebTokenError) res.status(402).json({ err });
  else console.log(err);
};
