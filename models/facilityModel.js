const db=require('./db')


function facilityIdGeneration() {
    return `FC${Date.now().toString(16)}`
}

async function getAllFacilities() {
    var query = 'SELECT * FROM facility';
    var data = await db.getQuery(query);
    return data;
}

async function addFacility(facilityName, capacity, currentAmount) {
    var facilityId = facilityIdGeneration();
    var query = `
        INSERT INTO facility (facility_id, name, capacity, current_amount)
        VALUES ('${facilityId}','${facilityName}',${capacity},${currentAmount})
    `
    await db.executeQuery(query);
}

async function getFacilityById(facilityId) {
    var query=`
        SELECT facility_id as "facilityId", name, current_amount as "currentAmount", capacity
        FROM facility
        WHERE facility_id='${facilityId}'
    `
    var data = await db.getOne(query);
    return data;
}

async function updateFacility(facilityId, facilityName, capacity) {
    var query = `
        UPDATE facility
        SET name='${facilityName}',
        capacity = ${capacity}
        WHERE facility_id='${facilityId}';
    `
    await db.executeQuery(query);
}

module.exports={getAllFacilities,addFacility,getFacilityById,updateFacility}