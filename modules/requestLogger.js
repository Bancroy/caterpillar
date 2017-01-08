const morgan = require('morgan');

function initRequestLogger(app) {
  const requestLogger = morgan('tiny');
  app.use(requestLogger);
}

module.exports = initRequestLogger;
