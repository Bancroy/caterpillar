const database = require(`${_config.paths.modules}/database`);

class TestsCtrl {
  listEntities(request, response, next) {
    database.read('Test').run().then((tests) => {
      response.json({ results: tests });
    }).catch(error => next(error));
  }

  saveEntity(request, response, next) {
    const data = request.body;

    database.create('Test', data).then((test) => {
      response.json(test);
    }).catch(error => next(error));
  }

  getSingleEntity(request, response, next) {
    const id = request.params.id;

    database.readOne('Test').where('_id').equals(id).run().then((test) => {
      response.json(test);
    }).catch(error => next(error));
  }

  removeEntity(request, response, next) {
    const id = request.params.id;

    database.deleteOne('Test').where('_id').equals(id).run().then((test) => {
      response.json(test);
    }).catch(error => next(error));
  }

  replaceEntity(request, response, next) {
    const id = request.params.id;
    const newObject = request.body;

    database.replace('Test', id, newObject).then((newTest) => {
      response.json(newTest);
    }).catch(error => next(error));
  }

  updateEntity(request, response, next) {
    const id = request.params.id;
    const changes = request.body;

    database.updateOne('Test', changes).where('_id').equals(id).run().then((test) => {
      response.json(test);
    }).catch(error => next(error));
  }
}

module.exports = new TestsCtrl();
