import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import { getUserInfo } from '../controllers/users';
import { emailRegex } from '../utils/constants';

const userRouter = Router();

userRouter.get('/me', getUserInfo);
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().pattern(emailRegex),
    }),
  }),
);

export default userRouter;
