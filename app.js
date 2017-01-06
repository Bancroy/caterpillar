const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

global._config = require('./config');
const logger = require(`${_config.paths.modules}/logger`);
const routes = require(_config.paths.routes);

const app = express();

app.use(
  helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"] } }),
  helmet.dnsPrefetchControl(),
  helmet.frameguard({ action: 'deny' }),
  helmet.hidePoweredBy(),
  // helmet.hpkp({ maxAge: 7776000, sha256s: [], includeSubdomains: true }),
  // helmet.hsts({ maxAge: 10886400, force: true, preload: true }),
  helmet.ieNoOpen(),
  helmet.noSniff(),
  helmet.referrerPolicy({ policy: 'no-referrer' }),
  helmet.xssFilter()
);
logger('info', 'security enabled');

app.use(
  cors(),
  compression(),
  bodyParser.json()
);
logger('info', 'middleware applied');

logger('info', `current api version ${_config.apiVersion}`);
routes(app, `/api/${_config.apiVersion}`);
logger('info', 'routes attached');

module.exports = app;
