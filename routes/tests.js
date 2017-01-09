const express = require('express');

const countHeader = require(`${_config.paths.middleware}/countHeader`);
const testsCtrl = require(`${_config.paths.controllers}/tests`);

const router = express.Router();

router.get('/', getTotalCount(), testsCtrl.listEntities);
router.get('/:id', testsCtrl.getSingleEntity);
router.post('/', testsCtrl.saveEntity);
router.delete('/:id', testsCtrl.removeEntity);
router.patch('/:id', testsCtrl.updateEntity);
router.put('/:id', testsCtrl.replaceEntity);

function getTotalCount() {
  return countHeader('Test', () => {
    return Promise.resolve({});
  });
}

module.exports = router;
