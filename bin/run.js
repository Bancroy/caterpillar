#!/usr/bin/env node

const _config  = require('../config');

const app = require(`${_config.server.root}/app`);

const server = app.listen(_config.server.port, () => {
  console.log(`Server is listening on port ${_config.server.port}...`);
});
