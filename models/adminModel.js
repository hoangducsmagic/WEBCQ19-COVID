const { Query } = require("pg");
const db = require("./db");

async function lockUser(accountId) {
    let query = `
        UPDATE account SET locked = '${true}' from patient pa 
        WHERE username = pa.citizen_id AND pa.patient_id = '`+accountId+`'`;
    let data = await db.getQuery(query);
    return data;
}

module.exports={lockUser}