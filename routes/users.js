const express = require('express');
// const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
