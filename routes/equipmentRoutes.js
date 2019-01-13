var express = require('express');
var router = express.Router();
var equipmentController = require('../controllers/equipmentController.js');

/*
 * GET
 */
router.get('/', equipmentController.logger, equipmentController.list);

/*
 * GET
 */
router.get('/:id', equipmentController.logger, equipmentController.show);

/*
 * POST
 */
router.post('/generateDummies', equipmentController.logger, equipmentController.generateDummies);
router.post('/', equipmentController.logger, equipmentController.create);

/*
 * PUT
 */
router.put('/:id', equipmentController.logger, equipmentController.update);

/*
 * DELETE
 */
router.delete('/:id', equipmentController.logger, equipmentController.remove);


module.exports = router;