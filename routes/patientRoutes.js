const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

router.get('/detail/:id', patientController.showPatientDetail);
router.get('/create', patientController.dummy);
router.post('/create', patientController.dummy);
router.get('/edit', patientController.dummy);
router.put('/edit', patientController.dummy);
router.get('/', patientController.showPatientList);

module.exports = router;