const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const signInRouter = require('./signin');
const signUpRouter = require('./signup');
const auth = require('../middlewares/auth');

router.use('/signup', signUpRouter);
router.use('/signin', signInRouter);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);

module.exports = router;
