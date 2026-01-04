const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pedidosController = require('../controllers/pedidosController');

router.get('/', auth, pedidosController.getAll);
router.post('/', auth, pedidosController.create);
router.put('/:id', auth, pedidosController.update);
router.delete('/:id', auth, pedidosController.delete);

module.exports = router;
