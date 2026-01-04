const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const produtosController = require('../controllers/produtosController');

router.get('/', auth, produtosController.getAll);
router.post('/', auth, produtosController.create);
router.put('/:id', auth, produtosController.update);
router.delete('/:id', auth, produtosController.delete);

module.exports = router;
