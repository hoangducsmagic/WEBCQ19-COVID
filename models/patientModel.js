const db = require("./db");

function patientIdGeneration() {
    return `PT${Date.now().toString(16)}`
}

async function getAllPatients(keyword) {
    var query = `
    SELECT p.patient_id as "patientId", p.name as "patientName", p.status as "patientStatus", f.name as "facilityName"
    FROM patient p
    JOIN facility f on p.current_facility_id=f.facility_id
    `;
    if (keyword) {
        if (keyword != '') {
            query+=` WHERE khongdau(lower(p.name)) ~ '${keyword}'`
        }
    }
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

async function getStatusChangeById(patientId) {
    var query = `
        SELECT status_change_id as "statusChangeId", status_from as "statusFrom", status_to as "statusTo", to_char(date,'dd/mm/yyyy') as "date"
        FROM statushistory
        WHERE patient_id='${patientId}' AND status_from<>-1
    `

    var data = await db.getQuery(query);
    return data;
}

async function getFacilityChangeById(patientId) {
    var query = `
        SELECT t.transfer_id as "transferId", ff.name as "facilityFromName", ft.name as "facilityToName", to_char(t.date,'dd/mm/yyyy') as "date"
        FROM transferhistory t
        JOIN facility ff ON t.from_facility_id=ff.facility_id
        JOIN facility ft ON t.to_facility_id=ft.facility_id
        WHERE patient_id='${patientId}'
    `

    var data = await db.getQuery(query);
    return data;
}

async function getPatientInfo(patientId) {
    var patientInfo = await getPatientById(patientId);
    var relatedInfo = await getRelatedById(patientId);
    var statusChangeInfo = await getStatusChangeById(patientId);
    var facilityChangeInfo = await getFacilityChangeById(patientId);
        
    if (relatedInfo.length>0) patientInfo.relatedList = relatedInfo;
    if (statusChangeInfo.length>0) patientInfo.statusChangeList = statusChangeInfo;
    if (facilityChangeInfo.length>0) patientInfo.facilityChangeList = facilityChangeInfo;

    return patientInfo;
}



async function changeFacility(patientId, oldFacility, newFacility,date) {
    if (oldFacility == newFacility) return;
    var newTransferId=Date.now().toString(16);
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
    
    var query4 = `
        INSERT INTO transferhistory (transfer_id,patient_id,from_facility_id,to_facility_id,date)
        VALUES ('${newTransferId}','${patientId}','${oldFacility}','${newFacility}','${date}')
    `
    await db.executeQuery(query4);
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

async function setStatus(patientId, status) {
    var query = `
        UPDATE patient SET status=${status} WHERE patient_id='${patientId}'
    `
    await db.executeQuery(query);
}

async function addStatusHistory(patientId, oldStatus, newStatus, date) {
    var newStatusChangeId = Date.now().toString(16);
    var statusChangeQuery = `
    INSERT INTO statushistory (status_change_id,patient_id,status_from,status_to,date)
    VALUES ('${newStatusChangeId}','${patientId}',${oldStatus},${newStatus},'${date}')
    `
    await db.executeQuery(statusChangeQuery);
}

async function updateStatus(patient, oldStatus, newStatus,date) {   
    // Đây là hàm đệ quy dùng trong chuyển từ F lớn sang F nhỏ
    var delta = oldStatus - newStatus;
    if (delta<=0) return;
    await setStatus(patient, newStatus);
    await addStatusHistory(patient, oldStatus, newStatus, date);
    var relatedList = await getRelatedById(patient);
    for (let person of relatedList) {
        if (person.patientStatus > oldStatus) {
            updateStatus(person.patientId,person.patientStatus,person.patientStatus-delta)
        }
    }
}

async function unDoubt(parentId, currentId, currentStatus, date) {
    var relatedList = await getRelatedById(currentId);
    if (currentId == parentId) {
        await cured(currentId, date);
    } else {
        var tmp = true;
        
        for (let person of relatedList) {
            if (person.patientId != parentId && person.patientStatus != -1 && person.patientStatus < currentStatus) {
                tmp = false;
                break;
            }
        }
        if (tmp == false) return;
        await cured(currentId, date);
    }
    for (let person of relatedList) {
        if (person.patientStatus > currentStatus) {
            unDoubt(currentId, person.patientId,person.patientStatus,date);
        }
    }
}

async function cured(patientId, date) {   // khỏi bệnh
    var patientInfo = await getPatientById(patientId);
    await setStatus(patientId, -1);
    await addStatusHistory(patientId, patientInfo.patientStatus, -1, date);
    var facilityQuery = `
        UPDATE facility
        SET current_amount=current_amount-1
        WHERE facility_id='${patientInfo.facilityId}'
    `
    await db.executeQuery(facilityQuery);
}

async function changeStatus(patientId, oldStatus, newStatus,date) {
    // ============= F0 sang khỏi bệnh==================
    if (oldStatus == 0 && newStatus == -1) {
        await cured(patientId, date);
        return;
    }

    // ============= F lớn sang F nhỏ================== 
    if (oldStatus > newStatus && newStatus != -1) {
        updateStatus(patientId, oldStatus, newStatus, date);
        return;
    }    

    // ============= Fx sang khỏi bệnh================== 
    if (oldStatus > 0 && newStatus == -1) {
        unDoubt(patientId, patientId, oldStatus,date);
        return;
    }    

}

module.exports = {
    getAllPatients,
    getRelatedById,
    getPatientInfo,
    getPatientById,
    changeStatus,
    changeFacility,
    addPatient
};
