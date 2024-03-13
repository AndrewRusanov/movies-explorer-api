const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => new NotFoundError('Пользователь с указанным ID не найден'));
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};

module.exports.editUserInfo = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true }).orFail(() => NotFoundError('Пользователь с указанным ID не найден'));
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequest(error.message));
    }
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password').orFail(new BadRequest('Неправильные имя пользователя или пароль'));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new BadRequest('Неверный пароль');
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    return res.status(HTTP_STATUS_OK).send({ token });
  } catch (error) {
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(new ConflictError(`Пользователь с email: ${email} уже существует`));
    }
    const user = User.create({ email, password: hash, name });
    return res.status(HTTP_STATUS_CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictError('Такой пользователь уже существует'));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequest(error.message));
    }
    return next(error);
  }
};
