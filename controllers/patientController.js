
const Patient = require("../models/patientModel");

// [GET] /patients/
async function showPatientList(req, res) {
    var data = await Patient.getAllPatients();
    res.render("patients/patientsList", data);
}

// [GET] /patients/detail/:id
async function showPatientDetail(req, res) {
    var data = await Patient.getPatientInfo(req.params.id);
     res.render('patients/patientDetail',data)
}

async function dummy(req, res) {
    var data = await getAllPatients();
    console.log(data);
    res.send("dummy");
}

module.exports = { dummy, showPatientList, showPatientDetail };
