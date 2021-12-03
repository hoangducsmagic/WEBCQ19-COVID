const { getQuery } = require("../models/db");

// [GET] /patients/
async function showPatientList(req, res) {
    var data = await getAllPatients();
    res.render("patients/patientsList", data);
}

// [GET] /patients/detail/:id
async function showPatientDetail(req, res) {
    var data = await getPatientById(req.params.id);
    res.send(data);
    // res.render('patients/patientsList',data)
}

async function getAllPatients() {
    var query = `
    SELECT p.patient_id as "patientId", p.name as "patientName", p.status as "patientStatus", f.name as "facilityName"
    FROM patient p
    JOIN facility f on p.current_facility_id=f.facility_id
    `;
    var data = await getQuery(query);
    return { patients: data };
}

async function getPatientById(patientId) {
    var query1 = `
    SELECT pt.patient_id as "patientId", pt.name as "patientName", pt.citizen_id as "patientCitizenId", pv.name as "provinceName", dt.name as "districtName", wa.name as "wardName", pt.status as "patientStatus", pt.username as "patientUsername",fc.name as "facilityName", pt.dob as "patientBirthday" 
    FROM patient pt
    JOIN province pv on pt.province_id=pv.province_id
    JOIN district dt on pt.district_id=dt.district_id
    JOIN ward wa on pt.ward_id=wa.ward_id
    JOIN facility fc on pt.current_facility_id=fc.facility_id
    WHERE pt.patient_id='${patientId}'
    `;

    var query2 = `
    SELECT pr.main_patient_id as "id1", p1.name as "name1", p1.status as "status1", pr.related_patient_id as "id2", p2.name as "name2", p2.status as "status2"
    FROM patientrelation pr
    JOIN patient p1 on pr.main_patient_id=p1.patient_id
    JOIN patient p2 on pr.related_patient_id=p2.patient_id
    WHERE main_patient_id='${patientId}' OR related_patient_id='${patientId}'
    `;

    var patientInfo = await getQuery(query1);
    var relatedInfo = await getQuery(query2);

    res = patientInfo[0];
    res.relatedList = [];
    for (let person of relatedInfo) {
        var related = {};
        if (person.id1 === patientId) {
            related.patientId = person.id2;
            related.patientName = person.name2;
            related.patientStatus = person.status2;
        } else {
            related.patientId = person.id1;
            related.patientName = person.name1;
            related.patientStatus = person.status1;
        }
        res.relatedList.push(related);
    }

    return res;
}

async function dummy(req, res) {
    var data = await getAllPatients();
    console.log(data);
    res.send("dummy");
}

module.exports = { dummy, showPatientList, showPatientDetail };
