import { UserTalkRoom } from '../database/models';
import { Talk } from '../database/models/Talk.model';
import { TalkRoom } from '../database/models/TalkRoom.model';
import { User } from '../database/models/User.model';
import { ParamsError } from '../util/Error/ParamsError';

export class TalkRoomService {
  /**
   * @description talkRoom을 검색을해서 이미 있는 talkRoom인경우 찾아서 있는 talkRoom을반환한다.
   * 아닌경우 talkRoom을 생성해서 유저를 추가한다
   */
  public save = async (user: User, friends?: number[]) => {
    if (!friends || !Array.isArray(friends)) throw new ParamsError();

    const friendList = await User.findAll({ where: { id: { $in: friends } } });
    if (!friendList) throw new ParamsError();

    const loadtalkRoom = await User.find({
      attributes: ['talkRoomList'],
      include: [
        {
          model: TalkRoom,
          include: [
            {
              model: User,
              where: {
                id: { $In: [...friends, user.id] },
              },
            },
          ],
        },
      ],
    });

    if (loadtalkRoom) return loadtalkRoom.toJSON();

    const talkRoom = new TalkRoom();
    talkRoom.userList.push(...friendList, user);
    await talkRoom.save();

    return talkRoom.toJSON();
  };

  public read = async (talkRoomId: number) => {
    const talkRoom = await TalkRoom.findById(talkRoomId, {
      include: [User, Talk],
    });

    if (!talkRoom) throw new ParamsError();

    return talkRoom.toJSON();
  };

  public listRead = async (user: any) => {
    const userLoad = await User.findById(user.id, {
      attributes: ['talkRoomList'],
      include: [
        {
          model: TalkRoom,
          include: [User],
        },
      ],
    });

    if (!userLoad) throw new ParamsError();

    return userLoad.talkRoomList;
  };
  /**
   * @description 유저가 talkRoom을 나가는 서비스로 만약 마지막 유저인경우에 tlakRoom을 제거해준다
   */
  public exit = async (user: User, talkRoomId: number) => {
    const userTalkRoomLoad = <UserTalkRoom[]>await UserTalkRoom.findAll({
      where: {
        talkRoomId,
        userId: user.id,
      },
    });

    const count = userTalkRoomLoad.length;
    userTalkRoomLoad.forEach(val => {
      val.destroy();
    });

    if (count === 1) {
      await TalkRoom.destroy({ where: { id: <number>talkRoomId } });
    }
    return null;
  };

  public addUser = async (talkroomId: number, friendId?: number) => {
    if (!friendId) throw new ParamsError();

    const friend = await User.findById(friendId);
    if (!friend) throw new ParamsError();

    const talkroom = await TalkRoom.findById(talkroomId, {
      include: [User],
    });
    if (!talkroom) throw new ParamsError();

    talkroom.userList.push(friend);

    talkroom.save();

    return friend.toJSON();
  };

  public getTalk = async (talkRoomId: number) => {
    const talkList = await Talk.findAll({ where: { talkRoomId } });

    return talkList.map(talk => talk.toJSON());
  };
}
