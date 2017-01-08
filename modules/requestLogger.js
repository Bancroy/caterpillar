const fileStreamRotator = require('file-stream-rotator');
const morgan = require('morgan');

function initRequestLogger(app) {
  const requestLogger = morgan('tiny', { stream: fileRotationStream });
  app.use(requestLogger);

  if(_config.env === 'development') {
    const consoleRequestLogger = morgan('dev');
    app.use(consoleRequestLogger);
  }
}

const fileRotationStream = fileStreamRotator.getStream({
  date_format: 'DD-MM-YYYY',
  filename: `${_config.paths.logs}/%DATE%-requests.log`,
  frequency: 'daily',
  verbose: false
});

module.exports = initRequestLogger;
