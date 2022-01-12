const orderModel = require('../models/managerModel');

class OrderController {
    // [get], /order

    index(req, res, next) {
        res.render('order', { style: ['order.css'], js: ['order.js'] });
    }    
}

async function showOrder(req, res) {
    var data = await admin.lockUser(req.query);
    res.render("order/", { ...data,keyword:req.query.keyword });
}

module.exports = {
    showOrder
}
