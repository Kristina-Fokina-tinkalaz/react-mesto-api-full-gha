require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const cors = require('cors');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  /(https|http)?:\/\/(?:www\.|(?!www))mesto-tinkalaz.nomoredomains.monster\/[a-z]+\/|[a-z]+\/|[a-z]+(\/|)/,
];

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.some((e) => e.test && e.test(origin)) || allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});


mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
// app.use(cors());
// app.options('*', cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));
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
