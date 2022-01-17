const express = require('express');
const patientUserController = require('../controllers/patientUserController');

const router = express.Router();

router.get('/accountDetail/:id', patientUserController.showAccountDetail);
router.get('/charge', patientUserController.showChargingPage);
router.post('/charge', patientUserController.charging);
router.get('/payoffdept', patientUserController.showPayOffDeptPage);
router.post('/payoffdept', patientUserController.payOffDept);

module.exports = router;
