import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { SecretsManager } from 'aws-sdk';
import { Sequelize } from 'sequelize-typescript';
import { Friend, TalkRoom, UserTalkRoom, User, Talk } from './database/models';
import { development } from '../databaseConfig.json';
export class ExpressApp {
  public app: express.Application;
  constructor() {
    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(cors());
  }

  /**
   * bootStart
   */
  public static bootStart() {
    const expressApp = new ExpressApp();
    expressApp.privateDataLoad().then(databaseConfig => {
      expressApp.dataBaseLoad(
        databaseConfig.SecretString || JSON.stringify(development),
      );
    });

    return expressApp.app;
  }

  private async privateDataLoad() {
    const secretsManager = new SecretsManager({ region: 'ap-northeast-2' });

    const data = await secretsManager
      .getSecretValue({ SecretId: 'rds/dev/root' })
      .promise();
    return data;
  }

  private async dataBaseLoad(development: string) {
    const dbconfig = JSON.parse(development);
    const sequelize = new Sequelize({
      dialect: 'mariadb',
      database: dbconfig.database,
      host: dbconfig.host,
      password: dbconfig.password,
      logging: dbconfig.logging,
      username: dbconfig.username,
    });

    sequelize.addModels([Friend, TalkRoom, UserTalkRoom, Talk, User]);
    await sequelize.sync();

    console.log('✓ DB connection success.');
    console.log('  Press CTRL-C to stop\n');
    console.log('User', User.isInitialized);
    console.log('Friend', Friend.isInitialized);
    console.log('Talk', Talk.isInitialized);
    console.log('TalkRoom', TalkRoom.isInitialized);
    console.log('UserTalkRoom', UserTalkRoom.isInitialized);

    return sequelize;
  }
}
