import http2 from "http2";
import Movie from "../models/Movie.js";
import BadRequest from "../errors/BadRequest.js";
import NotFoundError from "../errors/NotFoundError.js";
import ForbiddenError from "../errors/ForbiddenError.js";

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = http2.constants;

export const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
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
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequest(error.message));
      } else {
        next(error);
      }
    });
};

export const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new NotFoundError("Фильм с указанным id не найден"))
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError("Фильм, с указанным id не найдена"));
      }
      if (movie.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("Фильм другого пользователя, его нельзя удалить")
        );
      }
      return Movie.deleteOne(movie).then(() => res.send({ message: "Карточка удалена" })
      );
    })
    .catch(next);
};
