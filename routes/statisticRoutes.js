const express = require('express');
const statisticController = require('../controllers/statisticController');

const router = express.Router();

router.get('/totalCases', statisticController.showTotalCasesPage); // người từng trạng thái theo thời gian
router.get('/statusChange', statisticController.showStatusChangePage);   // chuyển trạng thái
router.get('/packageConsumption', statisticController.showPackageConsumptionPage); // tiêu thụ gói
router.get('/productConsumption', statisticController.showProductConsumptionPage); // tiêu thụ sản phẩm
router.get('/payment', statisticController.showPaymentStatisticPage); // thống kê thanh toán & dư nợ

module.exports = router;