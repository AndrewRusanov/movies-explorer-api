import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import userRouter from './users';
import moviesRouter from './movies';
import auth from '../middlewares/auth';
import { emailRegex } from '../utils/constants';
import { createUser, login } from '../controllers/users';

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
