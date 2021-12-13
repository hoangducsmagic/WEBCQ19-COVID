const express = require('express');
const facilityController = require('../controllers/facilityController');

const router = express.Router();

router.get('/create', facilityController.dummy);     // giao diện thêm địa điểm
router.post('/create', facilityController.dummy);    // thêm địa điểm
router.get('/edit/:id', facilityController.dummy);   // giao diện điều chỉnh
router.put('/edit', facilityController.dummy);       // điều chỉnh

module.exports = router;