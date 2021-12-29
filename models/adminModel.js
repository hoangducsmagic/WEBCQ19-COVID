const { Query } = require("pg");
const db = require("./db");

async function lockUser(accountId) {
    let query = `
        UPDATE account SET locked = '${false}' from patient pa 
        WHERE username = pa.username AND pa.patient_id = '`+accountId+`'`;
    let data = await db.getQuery(query);
    return data;
}
