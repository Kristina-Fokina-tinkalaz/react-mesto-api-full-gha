const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
// const DataExistError = require('./errors/data-exist-err');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));
app.use('/', require('./routes/auth'));

app.use(auth, () => {
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
