const express = require('express');
const patientUserController = require('../controllers/patientUserController');
const mdwAccount=require('../middleware/init/account')

const router = express.Router();

router.get('/accountDetail/:id', patientUserController.showAccountDetail);
router.get('/charge', mdwAccount.checkPaymenetLogin,patientUserController.showChargingPage);
router.post('/charge', mdwAccount.checkPaymenetLogin,patientUserController.charging);
router.get('/payoffdebt', mdwAccount.checkPaymenetLogin,patientUserController.showPayOffDebtPage);
router.post('/payoffdebt', mdwAccount.checkPaymenetLogin,patientUserController.payOffDebt);

module.exports = router;
