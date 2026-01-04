const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fornecedoresController = require('../controllers/fornecedoresController');

router.get('/', auth, fornecedoresController.getAll);
router.post('/', auth, fornecedoresController.create);
router.put('/:id', auth, fornecedoresController.update);
router.delete('/:id', auth, fornecedoresController.delete);

module.exports = router;
