import { Request, Response } from 'express';
import { FriendService } from '../../service';
import { Controller } from '../controller';

export class FriendController extends Controller<FriendService> {
  constructor() {
    super(new FriendService());

    this.router.post('/', this.asyncWarp(this.save));
    this.router.get('/', this.asyncWarp(this.read));
    this.router.delete('/:id', this.asyncWarp(this.remove));
  }

  public async read(req: Request, res: Response) {
    const friendList = await this.service.read(req.body.profile);

    return res.status(201).json({ friend: friendList });
  }

  public async save(req: Request, res: Response) {
    const { profile: user, friend } = req.body;

    const saveFriend = await this.service.save(user, friend);

    return res.status(204).json({ friend: saveFriend });
  }

  public async remove(req: Request, res: Response) {
    const { profile: user } = req.body;
    const friend = req.params.id;

    await this.service.remove(user, friend);

    return res.status(204);
  }
}
