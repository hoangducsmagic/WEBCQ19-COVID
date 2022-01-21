const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

// router.get('/', orderController.index);
router.get('order/:id', orderController.showOrder)

module.exports = router;
