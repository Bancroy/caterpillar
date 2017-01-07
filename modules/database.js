const _ = require('lodash');
const chalk = require('chalk');
const mongoose = require('mongoose');

const defer = require(`${_config.paths.utils}/bundle`).defer;
const logger = require(`${_config.paths.modules}/logger`);
const schemas = require(_config.paths.schemas);

class Database {
  create(modelName, data) {
    const deferred = defer();

    const model = mongoose.model(modelName);
    model(data).save().then((result) => {
      deferred.resolve(result);
    }).catch(handleDatabaseError(deferred));

    return deferred.promise;
  }

  delete(modelName) {
    return deleteQuery(modelName, false);
  }

  deleteOne(modelName) {
    return deleteQuery(modelName, true);
  }

  init() {
    const deferred = defer();

    mongoose.Promise = global.Promise;

    const db = mongoose.connection;
    attachConnectionHandlers(db, deferred);
    generateModels(schemas);
    mongoose.connect(_config.database.uri, _config.database.options);

    return deferred.promise;
  }

  read(modelName) {
    return readQuery(modelName, false);
  }

  readOne(modelName) {
    return readQuery(modelName, true);
  }

  update(modelName, action, options = {}) {
    return updateQuery(modelName, action, options, false);
  }

  updateOne(modelName, action, options = {}) {
    return updateQuery(modelName, action, options, true);
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

function deleteQuery(modelName, single) {
  const model = mongoose.model(modelName);
  const query = model.find();

  query.run = function() {
    const deferred = defer();

    if(!single && query._conditions._id && !query._conditions._id.$in) {
      return Promise.reject(new Error('use single query for single id'));
    }

    if(single) {
      query.op = 'findOneAndRemove';
    }

    query.exec().then((response) => {
      if(query.op === 'find' && response.length === 0) {
        return Promise.reject(new Error('no documents to delete'));

        let operations = [];
        for(const result of response) {
          operations.push(result.remove(action));
        }

        return Promise.all(operations);
      } else {
        return Promise.resolve(response);
      }
    }).then((response) => {
      deferred.resolve(response);
    }).catch(handleDatabaseError(deferred));

    return deferred.promise;
  };

  return _.omit(query, 'exec');
}

function generateModels(schemas) {
  for(const schema in schemas) {
    const thisSchema = schemas[schema];
    thisSchema.set('strict', 'throw');
    thisSchema.post('create', logCreate);
    thisSchema.post('remove', logRemove);
    mongoose.model(schema, thisSchema);
  }
}

function handleDatabaseError(deferred) {
  return (error) => deferred.reject(new Error(error));
}

function idQueryLimitError() {
  return new Error('query with _id can return only one document');
}

function logCreate(document) {
  logger.silly('created new document', { $module: 'database' });
}

function logRemove(document) {
  logger.silly('deleted a document', { $module: 'database' });
}

function readQuery(modelName, single) {
  const model = mongoose.model(modelName);
  const query = model.find();

  query.limit(10);
  query.run = function() {
    const deferred = defer();

    if(single || query._conditions.hasOwnProperty('_id')) {
      query.op = 'findOne';
    }

    query.exec().then((results) => {
      if(query.op === 'findOne' && !results) {
        return Promise.reject(new Error('document not found'));
      }

      logger.silly(`read ${chalk.bold.magenta(results.length ? results.length : 1)}`
        + ` of ${chalk.bold.magenta(modelName)}`, { $module: 'database' });

      deferred.resolve(results);
    }).catch(handleDatabaseError(deferred));

    return deferred.promise;
  };

  return _.omit(query, 'exec');
}

function updateQuery(modelName, action, options, single) {
  const model = mongoose.model(modelName);
  const query = model.find();

  query.run = function() {
    const deferred = defer();

    if(!single && query._conditions._id && !query._conditions._id.$in) {
      return Promise.reject(new Error('use single query for single id'));
    }

    if(!action || _.isEmpty(action)) {
      return Promise.reject(new Error('empty action definition'));
    }

    if(single) {
      query.op = 'findOneAndUpdate';
      query._update = action;
      options.new = true;
      query.options = options;
    }

    query.exec().then((response) => {
      if(query.op === 'find' && response.length === 0) {
        return Promise.reject(new Error('no documents to update'));

        let operations = [];
        for(const result of response) {
          operations.push(result.update(action, options));
        }

        return Promise.all(operations);
      } else {
        return Promise.resolve(response);
      }
    }).then((response) => {
      deferred.resolve(response);
    }).catch(handleDatabaseError(deferred));

    return deferred.promise;
  };

  return _.omit(query, 'exec');
}

module.exports = new Database();
