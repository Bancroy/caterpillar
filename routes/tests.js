const express = require('express');

const database = require(`${_config.paths.modules}/database`);

const router = express.Router();

router.get('/', (request, response, next) => {
  database.read('Test').run().then((tests) => {
    response.json({ results: tests });
  }).catch(error => next(error));
});

router.get('/:id', (request, response, next) => {
  const id = request.params.id;

  database.readOne('Test').where('_id').equals(id).run().then((test) => {
    response.json(test);
  }).catch(error => next(error));
});

router.post('/', (request, response, next) => {
  const data = request.body;

  database.create('Test', data).then((test) => {
    response.json(test);
  }).catch(error => next(error));
});

router.delete('/:id', (request, response, next) => {
  const id = request.params.id;

  database.deleteOne('Test').where('_id').equals(id).run().then((test) => {
    response.json(test);
  }).catch(error => next(error));
});

router.patch('/:id', (request, response, next) => {
  const id = request.params.id;
  const changes = request.body;

  database.updateOne('Test', changes).where('_id').equals(id).run().then((test) => {
    response.json(test);
  }).catch(error => next(error));
});

router.put('/:id', (request, response, next) => {
  const id = request.params.id;
  const newObject = request.body;

  database.replace('Test', id, newObject).then((newTest) => {
    response.json(newTest);
  }).catch(error => next(error));
});

module.exports = router;
