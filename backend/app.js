const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/cards', auth, cors, require('./routes/cards'));
app.use('/users', auth, cors, require('./routes/users'));
//app.use('/', require('./routes/auth'));

app.use(() => {
  throw new NotFoundError('Такой страницы не существует');
});
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? { message: 'На сервере произошла ошибка' }
      : message,
  });
  next();
});
app.listen(PORT);
module.exports = router;
