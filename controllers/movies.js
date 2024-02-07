import Movie from '../models/Movie';

export const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

export const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRu,
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
    trailer,
    nameRu,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      Movie.findById(movie._id)
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch(next);
    })
    .catch((error) => (error.name === 'ValidationError'
      ? next(new Error('Переданы некорректные данные'))
      : next(error)));
};

export const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new Error('Фильм, с указанным id не найдена'));
      }
      if (movie.owner.toString() !== req.user._id) {
        return next(
          new Error('Фильм другого пользователя, его нельзя удалить'),
        );
      }
      return Movie.deleteOne(movie).then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};
