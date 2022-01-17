const express = require('express');
const productPackageController = require('../controllers/productPackageController');

const router  =  express.Router();

router.get('/', productPackageController.listProductPackage); // danh sách gói
router.get('/detail/:id', productPackageController.productPackageDetail); // chi tiết gói
router.post('/create', productPackageController.dummy); // thêm gói
router.get('/edit', productPackageController.dummy); // thông tin để chỉnh sửa
router.put('/edit', productPackageController.dummy); // thông tin để chỉnh sửa
router.delete('/:id', productPackageController.dummy); // xóa gói

module.exports = router;