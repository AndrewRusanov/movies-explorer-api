import { Joi, celebrate } from 'celebrate';
import { Router } from 'express';
import { emailRegex } from '../utils/constants.js';
import { login } from '../controllers/users.js';

const signInRouter = Router();

signInRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().pattern(emailRegex),
      password: Joi.string().required(),
    }),
  }),
  login,
);

export default signInRouter;
