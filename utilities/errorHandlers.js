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
}

module.exports = new ErrorHandlers();
