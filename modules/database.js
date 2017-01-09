const _ = require('lodash');
const chalk = require('chalk');
const mongoose = require('mongoose');

const defer = require(`${_config.paths.utils}/bundle`).defer;
const logger = require(`${_config.paths.modules}/logger`);
const getStackTrace = require(`${_config.paths.utils}/bundle`).getStackTrace;

class Database {
  create(modelName, data) {
    const deferred = defer();

    const model = _models[modelName];
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
    mongoose.connect(_config.database.uri, _config.database.options);

    return deferred.promise;
  }

  getModels() {
    const schemas = require(_config.paths.schemas);

    let models = {};
    for(const schema in schemas) {
      const thisSchema = schemas[schema];
      thisSchema.set('strict', 'throw');
      thisSchema.post('save', logCreate);
      thisSchema.post('remove', logRemove);
      models[schema] = mongoose.model(schema, thisSchema);
    }

    return models;
  }

  read(modelName) {
    return readQuery(modelName, false);
  }

  readOne(modelName) {
    return readQuery(modelName, true);
  }

  replace(modelName, id, data) {
    const deferred = defer();

    const model = _models[modelName];
    model(data).validate().then(() => {
      return model.findOneAndUpdate({ _id: id }, data, {
        overwrite: true,
        new: true
      });
    }).then((response) => {
      if(!response) {
        return deferred.reject(
          new _errors.NotFound('DOCUMENT_NOT_FOUND', 'database')
        );
      }

      deferred.resolve(response);
    }).catch(handleDatabaseError(deferred));

    return deferred.promise;
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
  const model = _models[modelName];
  const query = model.find();

  query.run = function() {
    const deferred = defer();

    if(_.isEmpty(query._conditions)) {
      return deferred.reject(new _errors.Internal('WIPE_ATTEMPT', 'database'));
    }

    if(!single && query._conditions._id && !query._conditions._id.$in) {
      logger.warn('inefficent query attempt', { trace: getStackTrace() });
      single = true;
    }

    if(single) {
      query.op = 'findOne';
    }

    query.exec().then((response) => {
      if(query.op === 'findOne' && !response) {
        return deferred.reject(
          new _errors.NotFound('DOCUMENT_NOT_FOUND', 'database')
        );
      }

      if(query.op === 'find' && response.length === 0) {
        return deferred.reject(
          new _errors.NotFound('NO_DOCUMENTS_SELECTED', 'database')
        );
      }

      if(single) {
        return response.remove();
      } else {
        let operations = [];
        for(const result of response) {
          operations.push(result.remove());
        }

        return Promise.all(operations);
      }
    }).then((response) => {
      deferred.resolve(response);
    }).catch(handleDatabaseError(deferred));

    return deferred.promise;
  };

  return _.omit(query, 'exec');
}

function handleDatabaseError(deferred) {
  return (error) => deferred.reject(new _errors.Database(error));
}

function idQueryLimitError() {
  return new Error('query with _id can return only one document');
}

function logCreate(document) {
  const metadata = _.extend(document.toObject(), { $module: 'database' });
  metadata._id = String(metadata._id);

  logger.silly('created new document', metadata);
}

function logRemove(document) {
  const metadata = _.extend(document.toObject(), { $module: 'database' });
  metadata._id = String(metadata._id);

  logger.silly('deleted a document', metadata);
}

function readQuery(modelName, single) {
  const model = _models[modelName];
  const query = model.find();

  query.limit(10);
  query.run = function() {
    const deferred = defer();

    if(!single && query._conditions._id && !query._conditions._id.$in) {
      logger.warn('inefficent query attempt', { trace: getStackTrace() });
      single = true;
    }

    if(single) {
      query.op = 'findOne';
    }

    query.exec().then((results) => {
      if(query.op === 'findOne' && !results) {
        return deferred.reject(
          new _errors.NotFound('DOCUMENT_NOT_FOUND', 'database')
        );
      }

      deferred.resolve(results);
    }).catch(handleDatabaseError(deferred));

    return deferred.promise;
  };

  return _.omit(query, 'exec');
}

function updateQuery(modelName, action, options, single) {
  const model = _models[modelName];
  const query = model.find();

  query.run = function() {
    const deferred = defer();

    if(!single && query._conditions._id && !query._conditions._id.$in) {
      logger.warn('inefficent query attempt', { trace: getStackTrace() });
      single = true;
    }

    if(!action || _.isEmpty(action)) {
      return deferred.reject(
        new _errors.BadRequest('EMPTY_UPDATE_ATTEMPT', 'database')
      );
    }

    if(single) {
      query.op = 'findOneAndUpdate';
      query._update = action;
      options.new = true;
      query.options = options;
    }

    query.exec().then((response) => {
      if(query.op === 'find' && response.length === 0) {
        return deferred.reject(
          new _errors.NotFound('NO_DOCUMENTS_SELECTED', 'database')
        );

        let operations = [];
        for(const result of response) {
          operations.push(result.update(action, options));
        }

        return Promise.all(operations);
      } else if(query.op === 'findOneAndUpdate' && !response) {
        return deferred.reject(
          new _errors.NotFound('DOCUMENT_NOT_FOUND', 'database')
        );
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
