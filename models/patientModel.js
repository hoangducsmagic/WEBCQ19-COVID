const db = require("./db");

async function getAllPatients() {
    var query = `
    SELECT p.patient_id as "patientId", p.name as "patientName", p.status as "patientStatus", f.name as "facilityName"
    FROM patient p
    JOIN facility f on p.current_facility_id=f.facility_id
    `;
    var data = await db.getQuery(query);
    return { patients: data };
}

async function getRelatedById(patientId) {
    var query = `
    SELECT pr.main_patient_id as "id1", p1.name as "name1", p1.status as "status1", pr.related_patient_id as "id2", p2.name as "name2", p2.status as "status2"
    FROM patientrelation pr
    JOIN patient p1 on pr.main_patient_id=p1.patient_id
    JOIN patient p2 on pr.related_patient_id=p2.patient_id
    WHERE main_patient_id='${patientId}' OR related_patient_id='${patientId}'
    `;

    var data = await db.getQuery(query);
    var res = [];

    for (let person of data) {
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
        res.push(related);
    }
    return res;
}

async function getPatientById(patientId) {
    // This function will return just the basic info, not related person
    var query = `
    SELECT pt.patient_id as "patientId", pt.name as "patientName", pt.citizen_id as "patientCitizenId", pv.name as "provinceName", dt.name as "districtName", wa.name as "wardName", pt.status as "patientStatus", pt.username as "patientUsername",fc.name as "facilityName", pt.dob as "patientBirthday" 
    FROM patient pt
    JOIN province pv on pt.province_id=pv.province_id
    JOIN district dt on pt.district_id=dt.district_id
    JOIN ward wa on pt.ward_id=wa.ward_id
    JOIN facility fc on pt.current_facility_id=fc.facility_id
    WHERE pt.patient_id='${patientId}'
    `;

    var data = await db.getQuery(query);
    return data;
}

async function getPatientInfo(patientId) {
    var patientInfo = await getPatientById(patientId);
    var relatedInfo = await getRelatedById(patientId);

    res = patientInfo[0];
    res.relatedList = relatedInfo;

    return res;
};

async function setStatus(patientId, newStatus) {
    var currentStatusQuery = `SELECT status FROM patient WHERE patient_id='${patientId}'`;
    var raw = await db.getQuery(currentStatusQuery);

    var currentStatus = raw[0].status;

    if (newStatus <= currentStatus) return;
    var updateQuery = `UPDATE patient SET status=${newStatus} WHERE patient_id='${patientId}'`;
    await db.executeQuery(updateQuery);

    var relatedPersons = await getRelatedById(patientId);
    for (let person of relatedPersons) {
        if (person.patientStatus > currentStatus)
            setStatus(
                person.patientId,
                person.patientStatus - (currentStatus - newStatus)
            );
    }
}

module.exports = { getAllPatients, getRelatedById, getPatientInfo, getPatientById, setStatus };
