const Facility=require('../models/facilityModel')

async function dummy(req, res) {
    res.send('dummy');
}

async function showCreateFacilityPage(req, res) {
    if (req.user.role!='admin')
        return res.redirect('/');
    res.render('admin/addFacility')
}

async function createFacility(req, res) {
    if (req.user.role!='admin')
        return res.redirect('/');
    const { facilityName, capacity } = req.body;

    await Facility.addFacility(facilityName, capacity, 0);
    res.redirect('/admin');
}

async function updateFacility(req, res) {
    if (req.user.role!='admin')
        return res.redirect('/');
    
    const facilityId = req.params.id;
    const { facilityName, capacity } = req.body;
    await Facility.updateFacility(facilityId, facilityName, capacity);
    res.redirect('/admin');
}

async function showUpdateFacilityPage(req, res) {
    if (req.user.role!='admin')
        return res.redirect('/');
    var facilityInfo = await Facility.getFacilityById(req.params.id);
    res.render('admin/editFacility', {
        ...facilityInfo,
        facilityId:req.params.id
    })
}

async function deleteFacility(req,res){
    var id=req.params.id;
    await Facility.deleteFacility(id);
    res.redirect("/admin");
}

module.exports={dummy,showCreateFacilityPage,createFacility,updateFacility,showUpdateFacilityPage,deleteFacility}