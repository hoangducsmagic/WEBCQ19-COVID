const orderModel = require('../models/managerModel');

async function showOrder(req, res) {
    var data = await orderModel.showOrder(req.query);
    res.render("order/", { ...data,keyword:req.query.keyword });
}

module.exports = {
    showOrder
}
