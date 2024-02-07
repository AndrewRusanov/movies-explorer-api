import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import { addMovie, deleteMovie, getMovies } from '../controllers/movies';
import urlRegex from '../utils/constants';

const moviesRouter = Router();
moviesRouter.get('/', getMovies);
moviesRouter.post(
  '/',
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
  }),
  addMovie,
);
moviesRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required(),
    }),
  }),
  deleteMovie,
);

export default moviesRouter;
