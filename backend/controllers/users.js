const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
const DataExistError = require('../errors/data-exist-err');
// const AuthorizationError = require('../errors/authorization-err');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }).then((user) => {
      res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    }).catch((err) => {
      if (err.name === 'ValidationEror') {
        next(new NotValidError('Некорректные данные'));
      } else if (err.code === 11000) {
        next(new DataExistError('Такой email уже зарегистрирован'));
      } else {
        next(err);
      }
    }));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      const result = [];
      users.forEach((user) => {
        result.push({
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      });
      res.send(result);
    })
    .catch(next);
};
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch(next);
};
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Передан невалидный ID пользователя');
      } else {
        res.send({
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch(next);
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationEror') {
        next(new NotValidError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationEror') {
        next(new NotValidError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }) });
    })
    .catch(next);
};
