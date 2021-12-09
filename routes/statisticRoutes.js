const express = require('express');
const statisticController = require('../controllers/statisticController');

const router = express.Router();

router.get('/totalCases', statisticController.dummy); // người từng trạng thái theo thời gian
router.get('/statusChange', statisticController.dummy);   // chuyển trạng thái
router.post('/packageConsumption', statisticController.dummy); // tiêu thụ gói
router.get('/productConsumption', statisticController.dummy); // tiêu thụ sản phẩm

module.exports = router;