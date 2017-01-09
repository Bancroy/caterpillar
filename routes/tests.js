const express = require('express');

const testsCtrl = require(`${_config.paths.controllers}/tests`);

const router = express.Router();

router.get('/', testsCtrl.listEntities);
router.get('/:id', testsCtrl.getSingleEntity);
router.post('/', testsCtrl.saveEntity);
router.delete('/:id', testsCtrl.removeEntity);
router.patch('/:id', testsCtrl.updateEntity);
router.put('/:id', testsCtrl.replaceEntity);

module.exports = router;
