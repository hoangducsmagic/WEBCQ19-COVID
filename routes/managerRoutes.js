const express = require('express');
const managerController = require('../controllers/managerController');

const router = express.Router();

router.get('/:username/accountHistory', managerController.showAccountHistory);     // xem lịch sử hoạt động

module.exports = router;