class ErrorHandlers {
  general() {
    return (error, request, response, next) => {
      let message = {
        errorCode: error.name,
        statusCode: error.status
      };

      if(error.violations) {
        message.violations = error.violations;
      }

      if(_config.env === 'development' && error.stack) {
        message.stack = error.stack.split('\n').map(line => line.trim());
      }

      response.status(error.status || 500).json(message);
    };
  }

  notFound() {
    return (request, response, next) => {
      next(new _errors.NotFound('INVALID_ROUTE'));
    };
  }

  transformStrictModeError() {
    return (error, request, response, next) => {
      if(error.name === 'StrictModeError') {
        let violations = {};
        violations[error.path] = 'OUT_OF_SCHEMA';
        error = new _errors.BadRequest(
          'INVALID_FIELD_NAME', 'database', violations
        );
      }

      next(error);
    };
  }

  transformSyntaxError() {
    return (error, request, response, next) => {
      if(error.name === 'SyntaxError') {
        error = new _errors.BadRequest('INVALID_SYNTAX');
      }

      next(error);
    };
  }
}

module.exports = new ErrorHandlers();
