const express = require('express');
const productController = require('../controllers/orderController');

const router = express.Router();

router.get('/create', productController.showCreateProductPage);
router.post('/create', productController.createProduct);
router.get('/edit', productController.showUpdateProductPage);
router.put('/edit', productController.editProduct);
router.get('/', productController.listProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;