import { sign } from 'jsonwebtoken';
import { secret } from '../../private-key.json';
import { User } from '../database/models/User.model';

export class UserService {
  public async login(profile: any) {
    let findUser = await User.findOne({
      where: {
        platformName: profile.platformName,
        socialId: profile.socialId,
      },
    });

    if (!findUser) findUser = await User.build(profile);
    else findUser.photos = profile.photos;

    findUser.save();

    const token = await sign({ id: findUser.id }, secret, { expiresIn: '3h' });
    return token;
  }

  public async userList(profile: any) {
    const userListData = await User.findAll();
    userListData.map((user: User) => user.get({ plain: true }));
    return userListData;
  }
}
