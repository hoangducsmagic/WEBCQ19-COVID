exports.checkLogin = async (req, res, next) => {
	if (req.user) {
		if (!req.user.locked) {
			next();
			return;
		}
		if (req.user.locked) req.logout();
	}
	res.redirect('/account/login');
};

exports.checkPaymenetLogin = async (req, res, next) => {
	if (req.cookies.token) {
		next();
		return;
	}
	res.redirect('/account/loginPayment');
};
