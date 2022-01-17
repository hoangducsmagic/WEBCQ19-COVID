const express = require('express');
const orderController = require('../controllers/orderController');

const router  =  express.Router();

router.get('/', productPackageController.listProductPackage); // danh sách gói
router.get('/order/:id', orderController.showOrder); 

module.exports = router;