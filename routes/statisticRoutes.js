const express = require('express');
const statisticController = require('../controllers/statisticController');

const router = express.Router();

router.get('/totalCases', productController.dummy); // người từng trạng thái theo thời gian
router.get('/statusChange', productController.dummy);   // chuyển trạng thái
router.post('/packageConsumption', productController.dummy); // tiêu thụ gói
router.get('/productConsumption', productController.dummy); // tiêu thụ sản phẩm

module.exports = router;