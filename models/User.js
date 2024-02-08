import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import AuthorizationError from '../errors/AuthorizationError';

const userScheme = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длина поля name: 2 символа'],
      maxlength: [30, 'Максимальная длина поля name: 30 символов'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Некорректный адрес электронной почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userScheme.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильный email или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthorizationError('Неправильный email или пароль');
        }
        return user;
      });
    });
};

export default mongoose.model('user', userScheme);
