const { redirect } = require('express/lib/response');
const orderModel = require('../models/orderModel');
const patientModel = require('../models/patientModel');

async function showOrder(req, res) {
    const total = req.body.totalPrice;
    const patientId = patientModel.getPatientIdByUsername(req.user.username);
    var data = await orderModel.showOrder(patientId.patientId,req.params.id,total);
    res.redirect('/productPackages');
}

module.exports = {
    showOrder
}
