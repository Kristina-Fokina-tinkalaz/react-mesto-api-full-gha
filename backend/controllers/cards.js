const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');
const NotValidError = require('../errors/not-valid-err');

module.exports.findCard = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationEror') {
        next(new NotValidError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      } else if (!card.owner.equals(req.user._id)) {
        throw new Forbidden('Это не ваша карточка');
      } else {
        return Card.findByIdAndRemove(req.params.cardId).then(() => res.send({ data: card }));
      }
    })
    .catch(next);
};
module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('карточка не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('карточка не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};
