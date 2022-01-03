const Facility=require('../models/facilityModel')

async function dummy(req, res) {
    res.send('dummy');
}

async function showCreateFacilityPage(req, res) {
    res.render('admin/addFacility')
}

async function createFacility(req, res) {
    const { facilityName, capacity } = req.body;

    await Facility.addFacility(facilityName, capacity, 0);
    res.redirect('/admin');
}

async function updateFacility(req, res) {
    
    const facilityId = req.params.id;
    const { facilityName, capacity } = req.body;
    await Facility.updateFacility(facilityId, facilityName, capacity);
    res.redirect('/admin');
}

async function showUpdateFacilityPage(req, res) {
    var facilityInfo = await Facility.getFacilityById(req.params.id);
    res.render('admin/editFacility', {
        ...facilityInfo,
        facilityId:req.params.id
    })
}

module.exports={dummy,showCreateFacilityPage,createFacility,updateFacility,showUpdateFacilityPage}