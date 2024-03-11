import { Joi, celebrate } from 'celebrate';
import { Router } from 'express';
import { emailRegex } from '../utils/constants.js';
import { createUser } from '../controllers/users.js';

const signUpRouter = Router();

signUpRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email().pattern(emailRegex),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

export default signUpRouter;
