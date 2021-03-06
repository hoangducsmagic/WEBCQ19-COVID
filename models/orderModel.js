const db = require('./db');

async function showOrder(orderId) {
    let query = `
        UPDATE SET total = SUM(p.price*od.order_amount) FROM order 
        INNER JOIN productpackage pp ON productpackage_id == pp.productpackage_id
        INNER JOIN productpackage_detail ppd on pp.productpackage_id == ppd.productpackage_id
        INNER JOIN product p on ppd.product_id == p.product_id
        INNER JOIN order_detail od ON order_id == od.order_id
        WHERE order_id = '`+orderId+`'`;
    let data = await db.getQuery(query);
    return data;
}

module.exports = {
    showOrder
}