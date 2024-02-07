import { Router } from 'express';
import userRouter from './users';
import moviesRouter from './movies';

const router = Router();

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

export default router;
