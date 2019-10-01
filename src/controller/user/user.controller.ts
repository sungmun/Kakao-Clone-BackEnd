import { Request, Response } from 'express';
import { UserService } from '../../service';
import { Controller } from '../controller';
import { auth } from '../../util/AuthMiddleware';

export class UserController extends Controller<UserService> {
  constructor() {
    super(new UserService());

    this.router.post('/', this.asyncWarp(this.login));
    this.router.get('/', auth, this.asyncWarp(this.userList));
  }

  public async login(req: Request, res: Response) {
    const token = await this.service.login(req.body.user);
    return res.status(201).json({ token });
  }

  public async userList(req: Request, res: Response) {
    const userList = await this.service.userList(req.body.profile);
    return res.status(202).json({ userList });
  }
}
