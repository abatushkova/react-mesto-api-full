const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const router = express.Router();

const paramsSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }).unknown(true),
};

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
}), createCard);
router.delete('/:cardId', celebrate(paramsSchema), deleteCard);
router.put('/:cardId/likes', celebrate(paramsSchema), likeCard);
router.delete('/:cardId/likes', celebrate(paramsSchema), dislikeCard);

module.exports = router;
