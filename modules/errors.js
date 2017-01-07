const logger = require(`${_config.paths.modules}/logger`);

class BadRequestError extends Error {
  constructor(errorCode, moduleName = 'server') {
    super();

    this.name = errorCode;
    this.status = 400;

    logger.silly('bad request error', { $error: this, $module: moduleName });
  }
}

class DatabaseError extends Error {
  constructor(error) {
    super();

    if(error.name === 'CastError') {
      this.name = 'INVALID_PARAMS';
      this.status = 400;
      this.violations = {};
      this.violations[error.path] = 'CAST_ERROR';
    } else {
      this.name = 'DATABASE_ERROR';
      this.status = 500;
    }


    logger.silly('database error', { $error: this, $module: 'database' });
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
