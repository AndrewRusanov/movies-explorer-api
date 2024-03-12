const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { urlRegex } = require('../utils/constants');

router.get('/', getMovies);
router.post(
  '/',
  celebrate(
    {
      body: Joi.object().keys({
        country: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        year: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().regex(urlRegex).required(),
        trailerLink: Joi.string().regex(urlRegex).required(),
        nameRU: Joi.string().required(),
        nameEN: Joi.string().required(),
        thumbnail: Joi.string().regex(urlRegex).required(),
        movieId: Joi.number().required(),
      }),
    },
    { abortEarly: false },
  ),
  addMovie,
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }, { abortEarly: false }),
  deleteMovie,
);

module.exports = router;
