import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import { getUserInfo } from '../controllers/users';

const userRouter = Router();

userRouter.get('/me', getUserInfo);
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
);

export default userRouter;
