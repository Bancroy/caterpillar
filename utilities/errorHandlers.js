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
