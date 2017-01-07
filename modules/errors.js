const logger = require(`${_config.paths.modules}/logger`);

class BadRequestError extends Error {
  constructor(errorCode, moduleName = 'server', violations = null) {
    super();

    this.name = errorCode;
    this.status = 400;
    if(violations) {
      this.violations = violations;
    }

    logger.silly('bad request error', { $error: this, $module: moduleName });
  }
}

class DatabaseError extends Error {
  constructor(error) {
    super();

    this.name = 'GENERIC_DATABASE_ERROR';
    this.status = 500;

    if(error.name === 'CastError') {
      this.name = 'INVALID_PARAMS';
      this.status = 400;
      this.violations = {};
      this.violations[error.path] = 'CAST_ERROR';
    }

    if(error.name === 'ValidationError') {
      let violations = {};

      for(const singleError in error.errors) {
        const thisError = error.errors[singleError];
        if(thisError.kind === 'required') {
          violations[thisError.path] = 'MISSING_FIELD';
        } else {
          violations[thisError.path] = 'INVALID_FORMAT';
        }
      }

      this.name = 'VALIDATION_FAILED';
      this.status = 422;
      this.violations = violations;
    }

    if(error.name === 'MongoError' && error.code === 11000) {
      this.name = 'DUPLICATES';
      this.status = 409;

      let field = error.message.split('index: ')[1];
      field = field.split(' dup key')[0];
      field = field.substring(0, field.lastIndexOf('_'));
      if(field.indexOf('$') > -1) {
        field = field.split('.$')[1];
      }
      let violations = {};
      violations[field] = 'DUPLICATE_VALUE';
      this.violations = violations;
    }

    if(this.name === 'GENERIC_DATABASE_ERROR') {
      logger.error('database error', { $error: this, $module: 'database' });
    } else {
      logger.silly('database error', { $error: this, $module: 'database' });
    }
  }
}

class InternalError extends Error {
  constructor(errorCode, moduleName = 'server') {
    super();

    this.name = errorCode;
    this.status = 500;

    logger.error('internal error', { $error: this, $module: moduleName });
  }
}

class NotFoundError extends Error {
  constructor(errorCode, moduleName = 'server') {
    super();

    this.name = errorCode;
    this.status = 404;

    logger.silly('not found error', { $error: this, $module: moduleName });
  }
}

module.exports = {
  BadRequest: BadRequestError,
  Database: DatabaseError,
  Internal: InternalError,
  NotFound: NotFoundError
};
