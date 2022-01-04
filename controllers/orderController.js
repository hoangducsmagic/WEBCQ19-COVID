const orderModel = require('../models/managerModel');

class OrderController {
    // [get], /order

    index(req, res, next) {
        res.render('order', { style: ['order.css'], js: ['order.js'] });
    }    
}

async function showOrder(req, res) {
    let total = 0;
    for (let col1 in $("priceUnit") &&  col2 in $("amountUnit")) {
        total = total + (priceUnit[col1] * amountUnit[col2]);
    }
    res.render('order/', {total
    })
}

module.exports = new OrderController();
