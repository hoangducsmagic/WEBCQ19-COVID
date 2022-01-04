const Manager = require('../models/managerModel')

async function showAccountHistory(req, res) {
    if (req.user.role!='manager')
        return res.redirect('/');
    const data = await Manager.getAccountHistory(req.params.username);
    res.render('admin/accountHistory', data);
}

module.exports={showAccountHistory}