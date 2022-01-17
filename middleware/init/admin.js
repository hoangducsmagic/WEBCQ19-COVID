const accountModel = require('../../models/accountModel');

exports.checkAdmin = async (req, res, next) =>{
    const checkAdmin = await accountModel.checkAdmin();
    if (checkAdmin) 
    {
        next();
        return;
    }
    res.redirect('/admin/create');
}

exports.checkNotAdmin = async (req, res, next) =>{
    const checkAdmin = await accountModel.checkAdmin();
    if (!checkAdmin) 
    {
        next();
        return;
    }
    res.redirect('/');
}