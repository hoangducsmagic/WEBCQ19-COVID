const express = require('express');
const productPackageController = require('../controllers/productPackageController');

const router = express.Router();

router.get('/', productController.dummy); // danh sách gói
router.get('/detail/:id', productController.dummy); // chi tiết gói
router.post('/create', productController.dummy); // thêm gói
router.get('/edit', productController.dummy); // thông tin để chỉnh sửa
router.put('/edit', productController.dummy); // thông tin để chỉnh sửa
router.delete('/:id', productController.dummy); // xóa gói




module.exports = router;