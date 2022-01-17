const Patient = require("../models/patientModel");
const Facility = require("../models/facilityModel");
const Location = require("../models/locationModel");
const accountM=require('../models/accountModel')

// [GET] /patients/
async function showPatientList(req, res) {
    if (req.user.role!='manager')
        return res.redirect('/');
    var data = await Patient.getAllPatients(req.query);
    res.render("patients/patientsList", { ...data,keyword:req.query.keyword });
}

// [GET] /patients/detail/:id
async function showPatientDetail(req, res) {
    if (req.user.role!='manager')
        return res.redirect('/');
    var data = await Patient.getPatientInfo(req.params.id);
    res.render("patients/patientDetail", data);
}

// [GET] /patients/create
async function showAddPage(req, res) {
    if (req.user.role!='manager')
        return res.redirect('/');
    var provinces = await Location.getAllProvinces();
    var facilities = await Facility.getAllFacilities();
    var patients = await Patient.getAllPatients();

    patientList=JSON.stringify(patients.patients);
    res.render("patients/addPatient", {
        provinces,
        facilities,
        patients:patients.patients,
        patientList
    });
}

// [GET] /patients/edit/:id
async function showEditPage(req, res) {
    if (req.user.role!='manager')
        return res.redirect('/');
    var data = await Patient.getPatientById(req.params.id);
    var facilities = await Facility.getAllFacilities();
    res.render("patients/editPatient", { ...data, facilities });
}

// [PUT] /patients/edit
async function updatePatient(req, res) {
    if (req.user.role!='manager')
        return res.redirect('/');
    var today = new Date().toISOString().split('T')[0];
    var currentData = await Patient.getPatientById(req.body.patientId);
    // change facility
    await Patient.changeFacility(
        req.body.patientId,
        currentData.facilityId,
        req.body.newFacility,
        today,
        req.user.username
    );

    // change status
    await Patient.changeStatus(
        req.body.patientId,
        currentData.patientStatus,
        req.body.newStatus,
        today,
        req.user.username
    );
    
    res.send(); // redirect is doing in js file
    
    
}

async function getLocationData(req, res) {
    if (req.user.role!='manager')
        return res.redirect('/');
    if (req.query.province) {
        var districts = await Location.getAllDistricts(req.query.province);
        res.send(districts);
        return;
    } else if (req.query.district) {
        var wards = await Location.getAllWards(req.query.district);
        res.send(wards);
        return;
    }
    res.send(null);
}

async function addPatient(req, res) {
    if (req.user.role!='manager')
        return res.redirect('/');
    await accountM.add({ username: req.body.citizenID, password: req.body.citizenID }, 'patient');
    await Patient.addPatient(req.body);
    res.redirect('/patients');
}

module.exports = {
    showPatientList,
    showPatientDetail,
    showAddPage,
    showEditPage,
    updatePatient,
    getLocationData,
    addPatient
};
