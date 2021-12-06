const db = require("./models/db");

async function cal() {
    var query = "SELECT * FROM patient";
    var data = await db.getQuery(query);
    console.log(data);
}

cal();
