exports.checkLogin = async (req, res, next) =>{
    if (req.user) 
    {
        next();
        return;
    }
    res.redirect('/account/login');
}
