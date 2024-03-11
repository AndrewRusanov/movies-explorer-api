import { Joi, celebrate } from 'celebrate';
import { Router } from 'express';
import { login } from '../controllers/users.js';

const signInRouter = Router();

signInRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

export default signInRouter;
