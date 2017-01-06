const mongoose = require('mongoose');

const defer = require(`${_config.paths.utils}/bundle`).defer;
const logger = require(`${_config.paths.modules}/logger`);

class Database {
  init() {
    const deferred = defer();

    mongoose.Promise = global.Promise;

    const db = mongoose.connection;
    db.once('open', () => {
      logger('info', 'connection to MongoDB established', {
        $module: 'database'
      });

      deferred.resolve();
    });

    db.on('error', (error) => {
      logger('error', 'database connection error', {
        $module: 'database',
        $error: error
      });

      deferred.reject();
    });

    mongoose.connect(_config.database.uri, _config.database.options);

    return deferred.promise;
  }
}

module.exports = new Database();
