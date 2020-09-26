const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const UnauthError = require('../errors/unauth-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    minlength: [2, 'Минимальное количество символов: 2'],
    maxlength: [30, 'Максимальное количество символов: 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    minlength: [2, 'Минимальное количество символов: 2'],
    maxlength: [30, 'Максимальное количество символов: 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    validate: {
      validator: (link) => link.match(/(https?:\/\/)([a-z0-9_\W]+\.)+([a-z0-9_\W]+)+/gmi),
      message: 'Пожалуйста, введите корректный адрес',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        console.log('is nothing here');
        throw new UnauthError('Передан неверный логин или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthError('Передан неверный логин или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
