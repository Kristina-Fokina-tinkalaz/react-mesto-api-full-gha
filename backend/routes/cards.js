const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  findCard,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');
const validateURL = require('../errors/validate-url');
// const digitRegExp = /^https?:\/\/(www.)?[\w.\-_~:/?#[\]@!$&'()*+,;=]*/g;

router.get('/', findCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validateURL),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), putLike);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteLike);

module.exports = router;
