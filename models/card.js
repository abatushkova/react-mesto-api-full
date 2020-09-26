const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    minlength: [2, 'Минимальное количество символов: 2'],
    maxlength: [30, 'Максимальное количество символов: 30'],
  },
  link: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    validate: {
      validator: (link) => link.match(/(https?:\/\/)([a-z0-9_\W]+\.)+([a-z0-9_\W]+)+/gmi),
      message: 'Пожалуйста, введите корректный адрес',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле обязательно для заполнения'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
