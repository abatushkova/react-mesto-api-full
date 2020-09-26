const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", '*'],
  },
}));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

// celebrate library error handler
// app.use(errors());

// custom 404 route not found handler
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

// custom server error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка, noooo'
      : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
