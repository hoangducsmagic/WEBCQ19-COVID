const db = require("./db");

function patientIdGeneration() {
    return `PA${Date.now().toString(16)}`
}

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
    SELECT pr.main_patient_id as "id1", p1.name as "name1", p1.status as "status1", pr.related_patient_id as "id2", p2.name as "name2", p2.status as "status2", f1.name as "facility1", f2.name as "facility2"
    FROM patientrelation pr
    JOIN patient p1 on pr.main_patient_id=p1.patient_id
    JOIN patient p2 on pr.related_patient_id=p2.patient_id
    JOIN facility f1 on p1.current_facility_id=f1.facility_id
    JOIN facility f2 on p2.current_facility_id=f2.facility_id
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
            related.facilityName = person.facility2;
        } else {
            related.patientId = person.id1;
            related.patientName = person.name1;
            related.patientStatus = person.status1;
            related.facilityName = person.facility1;
        }
        res.push(related);
    }
    return res;
}

async function getPatientById(patientId) {
    // This function will return just the basic info, not related person
    var query = `
    SELECT pt.patient_id as "patientId", pt.name as "patientName", pt.citizen_id as "patientCitizenId", pv.name as "provinceName", dt.name as "districtName", wa.name as "wardName", pt.status as "patientStatus", pt.username as "patientUsername",fc.name as "facilityName", fc.facility_id as "facilityId",to_char(pt.dob,'dd/mm/yyyy') as "patientBirthday" 
    FROM patient pt
    JOIN province pv on pt.province_id=pv.province_id
    JOIN district dt on pt.district_id=dt.district_id
    JOIN ward wa on pt.ward_id=wa.ward_id
    JOIN facility fc on pt.current_facility_id=fc.facility_id
    WHERE pt.patient_id='${patientId}'
    `;

    var data = await db.getQuery(query);
    return data[0];
}

async function getPatientInfo(patientId) {
    var patientInfo = await getPatientById(patientId);
    var relatedInfo = await getRelatedById(patientId);

    patientInfo.relatedList = relatedInfo;

    return patientInfo;
}

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

async function changeFacility(patientId, oldFacility, newFacility) {
    if (oldFacility == newFacility) return;

    var query1 = `
        UPDATE facility SET current_amount=current_amount-1 WHERE facility_id='${oldFacility}'
    `
    await db.executeQuery(query1);
    var query2 = `
        UPDATE facility SET current_amount=current_amount+1 WHERE facility_id='${newFacility}'
    `
    await db.executeQuery(query2);
    var query3 = `
        UPDATE patient SET current_facility_id='${newFacility}' WHERE patient_id='${patientId}'
    `
    await db.executeQuery(query3);
}

async function addPatient(data) {
    var newPatientId = patientIdGeneration();
    var addPatientQuery = `
        INSERT INTO patient (patient_id,name,citizen_id,dob,province_id,district_id,ward_id,status,current_facility_id,username)
        VALUES ('${newPatientId}','${data.name}','${data.citizenID}','${data.dob}','${data.province}','${data.district}','${data.ward}',${data.status},'${data.facility}','${data.citizenID}')
    `
    await db.executeQuery(addPatientQuery);

    var today = new Date().toISOString().split('T')[0];
    var newStatusChangeId = Date.now().toString(16);
    var statusChangeQuery = `
        INSERT INTO statushistory (status_change_id,patient_id,status_from,status_to,date)
        VALUES ('${newStatusChangeId}','${newPatientId}',-1,${data.status},'${today}')
    `
    await db.executeQuery(statusChangeQuery);

    var facilityQuery = `
        UPDATE facility
        SET current_amount=current_amount+1
        WHERE facility_id='${data.facility}'
    `
    await db.executeQuery(facilityQuery);

    for(let related of data.relatedPersons){
        let relatedQuery = `
            INSERT INTO patientrelation (main_patient_id,related_patient_id)
            VALUES ('${newPatientId}','${related}')
        `
        await db.executeQuery(relatedQuery);
    }

}

module.exports = {
    getAllPatients,
    getRelatedById,
    getPatientInfo,
    getPatientById,
    setStatus,
    changeFacility,
    addPatient
};
