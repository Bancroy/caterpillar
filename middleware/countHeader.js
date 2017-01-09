const database = require(`${_config.paths.modules}/database`);

function countHeader(modelName, criteriaResolver) {
  return (request, response, next) => {
    criteriaResolver().then((criteria) => {
      return database.count(modelName, criteria);
    }).then((result) => {
      response.set('X-Total-Count', result);
      next();
    }).catch(error => next(error));
  };
}

module.exports = countHeader;
