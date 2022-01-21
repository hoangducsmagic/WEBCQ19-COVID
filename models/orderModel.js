const db = require('./db');

function orderIdGeneration() {
    return `PT${Date.now().toString(16)}`
}

async function showOrder(patient_id, productPackageId, total) {
    orderId = orderIdGeneration();
    let query = `
        INSERT INTO public."order" (order_id, patient_id, productpackage_id, date, total)
        VALUES ('${orderId}','${patient_id}','${productPackageId}','${new Date().toISOString().split("T")[0]}',${total})
    `
    let data = await db.executeQuery(query);
    return data;
}

module.exports = {
    showOrder
}