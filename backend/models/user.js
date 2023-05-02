const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail, isURL } = require('validator');
const AuthorizationError = require('../errors/authorization-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String, minlength: 2, maxlength: 30, default: 'Жак-Ив Кусто',
  },
  about: {
    type: String, minlength: 2, maxlength: 30, default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [isURL, 'invalid url'],
  },
  email: {
    type: String, required: true, unique: true, select: false, validate: [isEmail, 'invalid email'],
  },
  password: { type: String, required: true, select: false },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Пользователь не найден');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError('Неверный пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
