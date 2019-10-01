import { Router } from 'express';

import { userRouter } from './user';
import { friendRouter } from './friend';
import { talkRoomRouter } from './talk-room';
import { auth } from 'src/util/AuthMiddleware';

const router = Router();

router.use('/user', userRouter);
router.use('/friend', auth, friendRouter);
router.use('/talk-room', auth, talkRoomRouter);

export const rootRouter = router;
