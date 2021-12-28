const Facility=require('../models/facilityModel')

async function dummy(req, res) {
    res.send('dummy');
}

async function showCreateFacilityPage(req, res) {
    res.render('admin/addFacility')
}

async function createFacility(req, res) {
    const { facilityName, capacity, currentAmount } = req.body;
    await Facility.addFacility(facilityName, capacity, currentAmount);
    res.redirect('/facilities');
}

async function updateFacility(req, res) {
    const facilityId = req.params.id;
    const { facilityName, capacity } = req.body;
    await Facility.updateFacility(facilityId, facilityName, capacity);
    res.redirect('/facilities');
}

module.exports={dummy,showCreateFacilityPage,createFacility,updateFacility}