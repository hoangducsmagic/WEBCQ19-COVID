const db = require("./db");

async function getStatusChangeData(dateFrom, dateTo) {
    var listQuery = `
        SELECT p.patient_id as "patientId", p.name as "patientName", s.status_from as "statusFrom", s.status_to as "statusTo", to_char(s.date,'dd/mm/yyyy') as "date"
        FROM statushistory s
        JOIN patient p ON p.patient_id=s.patient_id
        WHERE status_from<>-1 
    `;
    if (dateFrom) listQuery += ` AND date>='${dateFrom}'`;
    if (dateTo) listQuery += ` AND date<='${dateTo}'`;
    var listData = await db.getQuery(listQuery);

    var changedQuery = `
    SELECT COUNT(*) as "changedAmount"
    FROM statushistory s
    WHERE status_from<>-1 AND status_to<>-1
    `;
    if (dateFrom) changedQuery += ` AND date>='${dateFrom}'`;
    if (dateTo) changedQuery += ` AND date<='${dateTo}'`;
    var changedAmount = await db.getQuery(changedQuery);

    var curedQuery = `
    SELECT COUNT(*) as "curedAmount"
    FROM statushistory s
    WHERE status_from<>-1 AND status_to=-1
    `;
    if (dateFrom) curedQuery += ` AND date>='${dateFrom}'`;
    if (dateTo) curedQuery += ` AND date<='${dateTo}'`;
    var curedAmount = await db.getQuery(curedQuery);

    return {
        changedList: listData,
        totalChanged: changedAmount[0].changedAmount,
        totalCured: curedAmount[0].curedAmount,
    };
}

async function getTotalCases(dateFrom, dateTo) {
    var subQuery = `
    SELECT patient_id, MAX(date) as "maxdate"
	FROM statushistory
	WHERE true
    `;
    if (dateFrom) subQuery += ` AND date>='${dateFrom}'`;
    if (dateTo) subQuery += ` AND date<='${dateTo}'`;
    subQuery += ` GROUP BY patient_id`;

    var mainQuery = `
        SELECT a.status_to as "status", COUNT(*) as "amount"
        FROM statushistory a
        JOIN (${subQuery}) b
        ON a.patient_id=b.patient_id AND a.date=b.maxdate
        WHERE true
    `;
    if (dateFrom) mainQuery += ` AND date>='${dateFrom}'`;
    if (dateTo) mainQuery += ` AND date<='${dateTo}'`;
    mainQuery += ` GROUP BY a.status_to	ORDER BY a.status_to`;

    var data = await db.getQuery(mainQuery);

    return data;
}

async function getProductConsumption() {
    var query=`
    SELECT g.product_id as "productId", g.name as "productName", SUM(o.order_amount) as "soldAmount", g.unit as "productUnit"
    FROM order_detail o
    JOIN product g on g.product_id=o.product_id 
    GROUP BY g.product_id, g.name, g.unit
    `
    var data = await db.getQuery(query);
    return data;
}

async function getPackageConsumption() {
    var query=`
    SELECT g.productpackage_id as "packageId", g.name as "packageName", COUNT(*) as "soldAmount"
    FROM "order" o
    JOIN productpackage g on g.productpackage_id=o.productpackage_id 
    GROUP BY g.productpackage_id, g.name
    `
    var data = await db.getQuery(query);
    return data;

}


module.exports = { getStatusChangeData, getTotalCases, getProductConsumption ,getPackageConsumption};
