import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, res, next) => {
  const { authorzation } = req.headers;
  if (!authorzation || !authorzation.startsWith('Bearer ')) {
    return next(new Error('Ошибка авторизации'));
  }
  const token = authorzation.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new Error('Ошибка авторизации'));
  }
  req.user = payload;
  return next();
};

export default auth;
