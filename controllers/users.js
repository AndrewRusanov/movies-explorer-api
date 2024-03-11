const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch(next);
};

module.exports.editUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError(error.message));
      } else if (error.name === 'ValidationError') {
        next(new BadRequest(error.message));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
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

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hashPassword) => User.create({ name, email, password: hashPassword }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      name: user.name,
      _id: user._id,
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
