const mongoose = require('mongoose');

const defer = require(`${_config.paths.utils}/bundle`).defer;
const logger = require(`${_config.paths.modules}/logger`);
const schemas = require(_config.paths.schemas);

class Database {
  init() {
    const deferred = defer();

    mongoose.Promise = global.Promise;

    const db = mongoose.connection;
    attachConnectionHandlers(db, deferred);
    generateModels(schemas);
    mongoose.connect(_config.database.uri, _config.database.options);

    return deferred.promise;
  }
}

function attachConnectionHandlers(db, deferred) {
  db.once('open', () => {
    logger.info('connection to MongoDB established', { $module: 'database' });

    deferred.resolve();
  });

  db.on('error', (error) => {
    logger.error('database connection error', {
      $module: 'database',
      $error: error
    });

    deferred.reject();
  });
}

function generateModels(schemas) {
  for(const schema in schemas) {
    schema.set('strict', 'throw');
    mongoose.model(schema, schemas[schema]);
  }
}

module.exports = new Database();
