const db = require('./db')

async function getAccountHistory(username) {
    var res = {};
    var statusHistoryQuery = `
        SELECT p.name as "patientName", s.status_from as "statusFrom", s.status_to as "statusTo",to_char(s.date,'dd/mm/yyyy') as "date"
        FROM statushistory s
        JOIN patient p on s.patient_id=p.patient_id
        WHERE s.changer_username='${username}' AND s.status_from<>-1
    `
    res.statusChangeHistory = await db.getQuery(statusHistoryQuery);

    var statusHistoryQuery = `
        SELECT p.name as "patientName", ff.sname as "fromFacility", tf.name as "toFacility",to_char(t.date,'dd/mm/yyyy') as "date"
        FROM transferhistory t
        JOIN patient p on s.patient_id=p.patient_id
        JOIN facility ff on ff.facility_id=t.from_facility_id
        JOIN facility tf on tf.facility_id=t.to_facility_id
        WHERE s.changer_username='${username}'
    `
    res.facilityChangeHistory = await db.getQuery(statusHistoryQuery);

    var productChangeQuery = `
        SELECT p.name as "productName", to_char(c.date,'dd/mm/yyyy') as "date"
        FROM product_change_history c
        JOIN product p on p.product_id=c.product_id
        WHERE c.changer_username='${username}'
    `
    res.productChangeHistory=await db.getQuery(productChangeQuery)

    var packageChangeQuery = `
        SELECT p.name as "packageName", to_char(c.date,'dd/mm/yyyy') as "date"
        FROM product_package_change_history c
        JOIN productpackage p on p.productpackage_id=c.productpackage_id
        WHERE c.changer_username='${username}'
    `
    res.packageChangeHistory = await db.getQuery(packageChangeQuery)
    return res;
}

module.exports = { getAccountHistory }