exports.checkLogin = async (req, res, next) =>{
    if (req.user) 
    {
        next();
        return;
    }
    res.redirect('/account/login');
}

exports.checkPaymenetLogin = async (req, res, next) =>{
    if (req.cookies.token) 
    {
        next();
        return;
    }
    res.redirect('/account/loginPayment');
}
