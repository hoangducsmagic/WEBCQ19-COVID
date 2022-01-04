const db = require('./db');

async function showTotalPrice(orderId) {
    let query = `
        SELECT * FROM order INNER JOIN productpackage pp ON productpackage_id == pp.productpackage_id
        WHERE order_id = '`+orderId+`'`;
    let data = await db.getQuery(query);
    return data;
}

module.exports = {
    showTotalPrice
}