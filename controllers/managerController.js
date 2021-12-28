const Manager = require('../models/managerModel')

async function showAccountHistory(req, res) {
    const data = await Manager.getAccountHistory(req.params.username);
    res.render('admin/accountHistory', data);
}

module.exports={showAccountHistory}