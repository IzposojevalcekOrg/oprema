var express = require('express');
var router = express.Router();
var equipmentController = require('../controllers/equipmentController.js');

/*
 * GET
 */
router.get('/', equipmentController.list);

/*
 * GET
 */
router.get('/:id', equipmentController.show);

/*
 * POST
 */
router.post('/', equipmentController.create);

/*
 * PUT
 */
router.put('/:id', equipmentController.update);

/*
 * DELETE
 */
router.delete('/:id', equipmentController.remove);


module.exports = router;