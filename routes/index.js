import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import userRouter from './users.js';
import moviesRouter from './movies.js';
import auth from '../middlewares/auth.js';
import { emailRegex } from '../utils/constants.js';
import { createUser, login } from '../controllers/users.js';

const router = Router();

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().pattern(emailRegex),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
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

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);

export default router;
