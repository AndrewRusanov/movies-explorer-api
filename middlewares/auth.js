const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new AuthorizationError('Неправильные имя пользователя или пароль'));
    }
    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    return next(new AuthorizationError('Ошибка авторизации'));
  }
  req.user = payload;
  return next();
};
