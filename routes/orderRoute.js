const express = require('express');
const router = express.Router();

const orderController = require('../controllers/OrderController');
const { requireAuthAdmin } = require('../middleware/authMiddleware');

// router.get('/', orderController.index);
router.get('/', requireAuthAdmin, orderController.index);

module.exports = router;
