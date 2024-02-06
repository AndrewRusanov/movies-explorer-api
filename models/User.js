import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

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

export default mongoose.model('user', userScheme);
