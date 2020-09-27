const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }).unknown(true),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(/(https?:\/\/)([a-zA-Z0-9_\W]+\.)+([a-z0-9_\W]+)+/, 'link')
      .required(),
  }),
}), updateUserAvatar);

module.exports = router;
