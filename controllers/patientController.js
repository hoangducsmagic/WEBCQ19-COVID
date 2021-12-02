const {getQuery}=require('../models/db')

async function dummy(req, res) {
    var data = await getAllPatients();
    console.log(data);
    res.send("dummy")
}

async function getAllPatients() {
    var query = `
    SELECT p.patient_id as "patientId", p.name as "patientName", p.status as "patientStatus", f.name as "facilityName"
    FROM patient p
    JOIN facility f on p.current_facility_id=f.facility_id
    `
    var data = await getQuery(query);
    return data;
}

module.exports={dummy}