const db=require('./db')

async function getAllFacilities() {
    var query = 'SELECT * FROM facility';
    var data = await db.getQuery(query);
    return data;
}

module.exports={getAllFacilities}