const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  createUser, login, getUserInfo, editUserInfo,
} = require('../controllers/users');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { urlRegex } = require('../utils/constants');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }, { abortEarly: false }),
  createUser,
);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }, { abortEarly: false }),
  login,
);

router.use(auth);

router.get('/users/me', getUserInfo);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }, { abortEarly: false }),
  editUserInfo,
);

router.get('/movies', getMovies);
router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(urlRegex),
      trailerLink: Joi.string().required().pattern(urlRegex),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().pattern(urlRegex),
      movieId: Joi.number().required(),
    }),
  }, { abortEarly: false }),
  addMovie,
);
router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }, { abortEarly: false }),
  deleteMovie,
);

module.exports = router;
