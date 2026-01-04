const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const estoqueController = require('../controllers/estoqueController');

router.get('/', auth, estoqueController.getAll);
router.post('/', auth, estoqueController.create);
router.put('/:id', auth, estoqueController.update);
router.delete('/:id', auth, estoqueController.delete);

module.exports = router;
