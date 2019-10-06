import { User } from './../database/models/User.model';
import { Friend } from '../database/models';
import { NotFoundDataBaseDataError } from '../util/Error/NotFoundTokenError copy';

export class FriendService {
  public async read(user: User) {
    const data = await User.findOne({
      attributes: ['id'],
      include: [User],
      where: { id: user.id },
    });
    if (!data) throw new NotFoundDataBaseDataError();

    return data.friendList;
  }

  public async save(user: User, friend: any) {
    const [friendLoad] = await Friend.findOrCreate({
      where: {
        userId: user.id,
        friendId: friend,
      },
    });
    return friendLoad;
  }

  public async remove(user: User, friendId: number) {
    await Friend.destroy({
      where: {
        friendId,
        userId: user.id,
      },
    });

    return true;
  }
}
