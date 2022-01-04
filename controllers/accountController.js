const accountModel= require('../models/accountModel');

exports.login = (req, res) =>{
    if (req.user)
        {res.redirect('/'); return;}
    res.render('account/login',{ error: req.query.error});
}

exports.signup = (req, res) =>{
    if (req.user)
    {res.redirect('/'); return;}
    res.render('account/signup',{ error: req.query.error});
}
exports.add = async (req, res) =>{
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    if (await accountModel.add(user, 'manager'))
    res.redirect('/account/login');
    else
    res.redirect('/account/signup?error=tài khoản đã được sử dụng');
}

exports.changePassword = (req, res) =>{
    if (!req.user)
    {res.redirect('/account/login'); return;}
    res.render('account/changePassword', {error: req.query.error, username: req.user.username});
}

exports.postChangePassword = async (req, res) =>{
    const user = {
        username: req.user.username,
        password: req.body.password,
        curPassword:  req.body.curPassword
    }
    if (await accountModel.changePassword(user))
    res.redirect('/');
    else
    res.redirect('/account/changePassword?error=Mật khẩu cũ không đúng');
}

exports.checkFirstLogin = async(req, res) =>{
    if (!req.user)
        return res.redirect('/');
    const checkFirstLogin = await accountModel.checkLogin(req.user.username,req.user.username);
    if (checkFirstLogin)
    res.redirect('/account/changePassword');
    else
    res.redirect('/')
}