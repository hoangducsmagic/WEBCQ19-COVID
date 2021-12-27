const express = require('express');
const facilityController = require('../controllers/facilityController');

const router = express.Router();

router.get('/create', facilityController.showCreateFacilityPage);     // giao diện thêm địa điểm
router.post('/create', facilityController.createFacility);    // thêm địa điểm
router.get('/edit/:id', facilityController.dummy);   // giao diện điều chỉnh
router.put('/edit', facilityController.updateFacility);       // điều chỉnh
router.get('/', (req, res) => {
    res.send("This is facility list page")
})

module.exports = router;