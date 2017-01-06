const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

global._config = require('./config');

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

app.use(
  cors(),
  compression(),
  bodyParser.json()
);

const routes = require(_config.paths.routes);
routes(app, `/api/${_config.apiVersion}`);

module.exports = app;
