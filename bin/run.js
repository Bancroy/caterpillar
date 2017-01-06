#!/usr/bin/env node

const _config  = require('../config');

const app = require(`${_config.server.root}/app`);
const logger = require(`${_config.paths.modules}/logger`);

const server = app.listen(_config.server.port, () => {
  logger('info', `listening on port ${_config.server.port}`);
});
