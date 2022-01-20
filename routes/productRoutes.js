const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();


router.get('/detail/:id', productController.productDetail);
router.get('/create', productController.showCreateProductPage);
router.post('/create', productController.createProduct);
router.get('/edit/:id', productController.showUpdateProductPage);
router.put('/edit', productController.editProduct);
router.get('/', productController.listProduct);
router.get('/delete/:id', productController.deleteProduct);

module.exports = router;