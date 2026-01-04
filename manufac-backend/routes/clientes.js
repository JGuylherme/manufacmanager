const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const clientesController = require('../controllers/clientesController');

router.get('/', auth, clientesController.getAll);
router.post('/', auth, clientesController.create);
router.put('/:id', auth, clientesController.update);
router.delete('/:id', auth, clientesController.delete);

module.exports = router;
