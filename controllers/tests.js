const Test = _models.Test;

class TestsCtrl {
  listEntities(request, response, next) {
    Test.getList().then((tests) => {
      response.json({ results: tests });
    }).catch(error => next(error));
  }

  saveEntity(request, response, next) {
    const data = request.body;

    Test.saveEntity(data).then((test) => {
      response.json(test);
    }).catch(error => next(error));
  }

  getSingleEntity(request, response, next) {
    const id = request.params.id;

    Test.getById(id).then((test) => {
      response.json(test);
    }).catch(error => next(error));
  }

  removeEntity(request, response, next) {
    const id = request.params.id;

    Test.removeById(id).then((test) => {
      response.json(test);
    }).catch(error => next(error));
  }

  replaceEntity(request, response, next) {
    const id = request.params.id;
    const newData = request.body;

    Test.replaceEntity(id, newData).then((newTest) => {
      response.json(newTest);
    }).catch(error => next(error));
  }

  updateEntity(request, response, next) {
    const id = request.params.id;
    const changes = request.body;

    Test.updateById(id, changes).then((test) => {
      response.json(test);
    }).catch(error => next(error));
  }
}

module.exports = new TestsCtrl();
