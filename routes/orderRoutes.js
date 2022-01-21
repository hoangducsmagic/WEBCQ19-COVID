const express = require('express');
const router = express.Router();

const orderController = require('../controllers/OrderController');

// router.get('/', orderController.index);
router.post('/:id', orderController.showOrder)

module.exports = router;
