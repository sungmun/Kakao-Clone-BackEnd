import { Request, Response, NextFunction } from 'express';
import { NotFoundTokenError } from './Error/NotFoundTokenError';
import { User } from '../database/models/User.model';
import { verify } from 'jsonwebtoken';
import { secret } from '../../private-key.json';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token'] || req.query.token;
  if (!token) throw new NotFoundTokenError();

  const profile = <User>verify(token, secret);
  const userLoad = <User>await User.findByPk(profile.id);
  req.body.profile = userLoad.get({ plain: true });

  next();
};
