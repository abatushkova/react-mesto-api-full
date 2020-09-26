const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Запрос найти пользователя не прошел валидацию'));
      }

      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Входные данные создания пользователя не прошли валидацию'));
      }

      next(err);
    });
};

const updateUser = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Входные данные обновления профиля не прошли валидацию'));
      }

      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет пользователя с таким id'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Входные данные обновления аватар не прошли валидацию'));
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-secret-secret',
        { expiresIn: '7d' },
      );

      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
