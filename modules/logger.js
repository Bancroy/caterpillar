const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const prettyjson = require('prettyjson');
const serializeError = require('serialize-error');
const winston = require('winston');
require('winston-daily-rotate-file');

if(!fs.existsSync(_config.paths.logs)) {
  fs.mkdirSync(_config.paths.logs);
}

const fileTransport = new winston.transports.DailyRotateFile({
  filename: `${_config.paths.logs}/.log`,
  datePattern: 'dd-MM-yyyy',
  prepend: true,
  level: _config.env === 'development' ? 'debug' : 'info',
  timestamp: () => {
    return moment.utc().utcOffset(_config.server.utcOffset).format();
  }
});

const consoleTransport = new winston.transports.Console({
  colorize: true,
  level: 'silly',
  timestamp: () => {
    return moment().format('DD/MM/YYYY HH:mm:ss');
  },
  formatter: (options) => {
    const metadata = parseMeta(options.meta);
    const error = metadata.error;
    const meta = metadata.meta;
    const module = metadata.module ? metadata.module : null;

    const content = options.message;
    const prefix = generatePrefix(options.level, module);
    const timestamp = options.timestamp();

    return`${timestamp} ${prefix}: ${content}` +
      `${error ? '\n' + error : ''}${meta ? '\n' + meta : ''}`;
  }
})

let transports = [fileTransport];
if(_config.env === 'development') {
  transports.push(consoleTransport);
}

const logger = new winston.Logger({ transports: transports });

function loggerInterface(level, message, meta = {}) {
  const loglevels = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];

  if(!_.includes(loglevels, level)) {
    return new Error('invalid loglevel');
  }

  if(message && typeof message !== 'string') {
    return new Error('invalid message data type');
  }

  if(meta.$error) {
    meta.$error = serializeError(meta.$error);
  }

  if(!meta.$module) {
    meta.$module = 'server';
  }

  return logger.log(level, message, meta);
}

function generatePrefix(level, moduleName) {
  const modulePart = moduleName ? ` -> ${moduleName}` : '';
  let prefix = chalk.bold(`[${level.toUpperCase()}]${modulePart}`);

  switch(level) {
    case 'debug':
      prefix = chalk.green(prefix);
      break;
    case 'info':
      prefix = chalk.cyan(prefix);
      break;
    case 'warn':
      prefix = chalk.yellow(prefix);
      break;
    case 'error':
      prefix = chalk.red(prefix);
      break;
  }

  return prefix;
}

function parseMeta(meta) {
  const errorData = meta.$error ? meta.$error : null;
  const moduleName = meta.$module ? meta.$module : null;

  if(meta) {
    if(meta.$error) {
      delete meta.$error;
    }

    if(meta.$module) {
      delete meta.$module;
    }
  }

  let metadata = {
    error: null,
    meta: null,
    module: moduleName
  };

  if(errorData) {
    metadata.error = `${chalk.bold.bgRed.white('Error:')}\n`;
    metadata.error += prettyjson.render(errorData, { keysColor: 'red' });
  }

  if(meta && Object.keys(meta).length > 0) {
    metadata.meta = `${chalk.bold.bgBlue.white('Metadata:')}\n`;
    metadata.meta += prettyjson.render(meta, { keysColor: 'cyan' });
  }

  return metadata;
}

module.exports = loggerInterface;
