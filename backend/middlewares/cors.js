const allowedCors = [
  'https://mesto-tinkalaz.nomoredomains.monster',
  'http://mesto-tinkalaz.nomoredomains.monster',
  'localhost:3000'
];

module.exports = (req, res, next) => {
    const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', "*");
    const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers']; 
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE"; 
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
} 
  }

  next();
};
