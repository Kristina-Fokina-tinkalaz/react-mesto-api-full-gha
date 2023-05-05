const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const validateURL = require('../errors/validate-url');
const validateEmail = require('../errors/validate-email');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(8),
  }),
}), login);
module.exports = router;
