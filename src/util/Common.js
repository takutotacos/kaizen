const domain = process.env.NODE_ENV === 'production'
  ? process.env.BACKEND_URL
  : 'http://localhost:4200/';
exports.domain = domain;