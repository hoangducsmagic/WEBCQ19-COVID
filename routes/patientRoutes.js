const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

router.get('/detail/:id', patientController.showPatientDetail);
router.get('/create',patientController.showAddPage );
router.post('/create', patientController.addPatient);
router.get('/edit/:id', patientController.showEditPage);
router.put('/edit', patientController.updatePatient);
router.get('/location', patientController.getLocationData);
router.get('/', patientController.showPatientList);

module.exports = router;