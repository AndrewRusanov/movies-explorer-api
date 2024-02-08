import BadRequest from '../errors/BadRequest';
import NotFoundError from '../errors/NotFoundError';
import User from '../models/User';

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
