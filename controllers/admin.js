const Patient = require("../models/adminModel");

async function dummy(req, res) {
    var data = await lockUser();
    console.log(data);
    res.send("dummy");
}

async function lockUser(req, res) {
    
    var data = await admin.lockUser(req.query);
    res.render("admin/lockUser", { ...data,keyword:req.query.keyword });
}

module.exports = {
    dummy,
    showPatientList,
};
