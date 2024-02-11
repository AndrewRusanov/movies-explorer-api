import jwt from 'jsonwebtoken';
import AuthorizationError from '../errors/AuthorizationError.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, res, next) => {
  const { authorzation } = req.headers;
  if (!authorzation || !authorzation.startsWith('Bearer ')) {
    return next(new AuthorizationError('Ошибка авторизации'));
  }
  const token = authorzation.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new AuthorizationError('Ошибка авторизации'));
  }
  req.user = payload;
  return next();
};

export default auth;
