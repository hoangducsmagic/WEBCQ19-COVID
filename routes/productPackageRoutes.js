const express = require('express');
const productPackageController = require('../controllers/productPackageController');

const router  =  express.Router();

router.get('/', productPackageController.listProductPackage); // danh sách gói
router.get('/detail/:id', productPackageController.productPackageDetail); // chi tiết gói
router.get('/create', productPackageController.showCreateProductPackagePage)
router.post('/create', productPackageController.createProductPackage); // thêm gói
router.get('/edit/:id', productPackageController.showEditProductPackagePage); // thông tin để chỉnh sửa
router.put('/edit', productPackageController.editProductPackage); // thông tin để chỉnh sửa
router.delete('/delete/:id', productPackageController.deleteProductPackage); // xóa gói

module.exports = router;