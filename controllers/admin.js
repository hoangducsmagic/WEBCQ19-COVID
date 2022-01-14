const Admin = require("../models/adminModel");
const Facility = require('../models/facilityModel')
const Manager = require('../models/managerModel')

async function dummy(req, res) {
    var data = await lockUser();
    console.log(data);
    res.send("dummy");
}

async function lockUser(req, res) {
    if (req.user.role!='admin')
        return res.redirect('/');
    var data = await admin.lockUser(req.query);
    res.render("admin/lockUser", { ...data,keyword:req.query.keyword });
}

async function showDashboard(req, res) {
    var facilities = await Facility.getAllFacilities();
    var managers = await Manager.getAllManagers();
    res.render('admin/dashboard', {
        facilities,
        managers
    })
}

module.exports = {
    dummy,
    //showPatientList,
    lockUser,
    showDashboard
};
