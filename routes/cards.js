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
    cardId: Joi.string().length(24).hex(),
  }).unknown(true),
};

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi
      .string()
      .pattern(/(https?:\/\/)([a-z0-9_\W]+\.)+([a-z0-9_\W]+)+/gmi, 'link')
      .required(),
  }),
}), createCard);
router.delete('/:cardId', celebrate(paramsSchema), deleteCard);
router.put('/:cardId/likes', celebrate(paramsSchema), likeCard);
router.delete('/:cardId/likes', celebrate(paramsSchema), dislikeCard);

module.exports = router;
