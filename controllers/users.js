import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import BadRequest from '../errors/BadRequest';
import NotFoundError from '../errors/NotFoundError';
import User from '../models/User';
import ConflictError from '../errors/ConflictError';

const { NODE_ENV, JWT_SECRET } = process.env;

export const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

export const editUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => (!user
      ? next(new NotFoundError('Запрашиваемый пользователь не найден'))
      : res.send(user)))
    .catch((error) => (error.name === 'ValidationError'
      ? next(new BadRequest('Данные введены некорректно'))
      : next(error)));
};

export const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
};

export const createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hashPassword) => User.create({ name, email, password: hashPassword }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError(`Пользователь с email: ${email} уже существует`),
        );
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};
