const express = require('express');
const facilityController = require('../controllers/facilityController');

const router = express.Router();

router.get('/create', facilityController.showCreateFacilityPage);     // giao diện thêm địa điểm
router.post('/create', facilityController.createFacility);    // thêm địa điểm
router.get('/delete/:id', facilityController.deleteFacility);     // xóa địa điểm
router.get('/edit/:id', facilityController.showUpdateFacilityPage);   // giao diện điều chỉnh
router.put('/edit/:id', facilityController.updateFacility);       // điều chỉnh
router.get('/', (req, res) => {
    res.send("This is facility list page")
})

module.exports = router;