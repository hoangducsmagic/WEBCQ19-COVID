const express = require('express');
const managerController = require('../controllers/managerController');

const router = express.Router();

router.get('/create', managerController.dummy);     // giao diện tạo tài khoản
router.post('/create', managerController.dummy);    // tạo tài khoản
router.post('/lock/:id', managerController.dummy);  // khóa tài khoản
router.post('/detail/:id', managerController.dummy);    // xem lịch sử hoạt động

module.exports = router;