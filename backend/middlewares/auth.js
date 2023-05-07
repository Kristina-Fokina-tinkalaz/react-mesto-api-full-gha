const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/authorization-err');
require('dotenv').config();

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;

  next();
  return (payload);
};
