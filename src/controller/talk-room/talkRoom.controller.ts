import { Request, Response } from 'express';
import { TalkRoomService } from '../../service/TalkRooom.service';
import { Controller } from '../controller';

export class TalkRoomController extends Controller<TalkRoomService> {
  constructor() {
    super(new TalkRoomService());

    this.router.post('/', this.asyncWarp(this.save)); // 생성
    this.router.post('/:talkRoomId/user', this.asyncWarp(this.addUser)); // 유저추가

    this.router.get('/', this.asyncWarp(this.listRead)); // 목록
    this.router.get('/:talkRoomId', this.asyncWarp(this.read)); // 내용
    this.router.get('/:talkRoomId/talk', this.asyncWarp(this.readTalk)); // talk만 추출

    this.router.delete('/:id', this.asyncWarp(this.remove)); // 유저나가기
  }

  public async save(req: Request, res: Response) {
    const talkRoom = await this.service.save(
      req.body.profile,
      req.body.friends,
    );
    return res.status(201).send({ talkRoom });
  }
  public async readTalk(req: Request, res: Response) {
    const talkList = await this.service.getTalk(Number(req.params.talkRoomId));

    return res.status(200).json(talkList);
  }

  public async read(req: Request, res: Response) {
    const resData = await this.service.read(Number(req.params.talkRoomId));

    return res.status(200).json(resData);
  }

  public async listRead(req: Request, res: Response) {
    const talkRoomList = await this.service.listRead(req.body.profile);
    return res.status(200).json({ talkRoomList });
  }

  public async remove(req: Request, res: Response) {
    const removeRow = await this.service.exit(
      req.body.profile,
      Number(req.params.talkRoomId),
    );
    if (removeRow === 1) return res.status(204).send();
    return res.status(208).send();
  }

  public async addUser(req: Request, res: Response) {
    const friend = await this.service.addUser(
      Number(req.params.talkroomId),
      req.body.friend,
    );

    return res.status(201).json(friend);
  }
}
