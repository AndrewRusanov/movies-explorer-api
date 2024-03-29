const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const Movie = require('../models/Movie');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest(error.message));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new NotFoundError('Фильм с указанным id не найден'))
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм, с указанным id не найдена'));
      }
      if (movie.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError('Фильм другого пользователя, его нельзя удалить'),
        );
      }
      return Movie.deleteOne(movie).then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};
