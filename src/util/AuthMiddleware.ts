import { Request, Response, NextFunction } from 'express';
import { NotFoundTokenError } from './Error/NotFoundTokenError';
import { User } from '../database/models/User.model';
import { verify } from 'jsonwebtoken';
import { secret } from '../../private-key.json';
import { NotFoundUserError } from './Error/NotFoundUserError';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token'] || req.query.token;
  if (!token) throw new NotFoundTokenError();

  const id = <string>verify(token, secret);

  const profile = await User.findByPk(id);

  if (!profile) throw new NotFoundUserError();

  req.body = {
    ...req.body,
    profile,
  };
  next();
};
