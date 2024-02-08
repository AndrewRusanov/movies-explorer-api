import { Router } from 'express';
import userRouter from './users';
import moviesRouter from './movies';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);

export default router;
