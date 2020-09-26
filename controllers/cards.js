const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Входные данные создания карточки не прошли валидацию'));
      }

      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет карточки с таким id'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Запрос на удаление карточки не прошел валидацию'));
      }

      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет карточки с таким id'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Запрос на лайк карточки не прошел валидацию'));
      }

      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет карточки с таким id'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Запрос на дизлайк карточки не прошел валидацию'));
      }

      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
