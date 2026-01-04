const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const producaoController = require('../controllers/producaoController');

router.get('/', auth, producaoController.getAll);
router.post('/', auth, producaoController.create);
router.put('/:id', auth, producaoController.update);
router.delete('/:id', auth, producaoController.delete);

module.exports = router;
