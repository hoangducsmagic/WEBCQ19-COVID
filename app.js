const express = require('express');
const path = require('path');
const { create } = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const passport = require('./middleware/passport');

const patientRouter = require('./routes/patientRoutes');
const productRouter = require('./routes/productRoutes');
const statisticRouter = require('./routes/statisticRoutes');
const productPackageRouter = require('./routes/productPackageRoutes');
const facilityRouter = require('./routes/facilityRoutes');
const managerRouter = require('./routes/managerRoutes');
const accountRouter = require('./routes/accountRoutes');
const adminRouter = require('./routes/adminRoutes');
const patientUserRouter = require('./routes/patientUserRoutes');
const mdwAdmin = require('./middleware/init/admin');
const mdwAccount = require('./middleware/init/account');
const orderRouter = require('./routes/orderRoutes');

require('./models/db');
// Start express app
const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(methodOverride('_method'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// Set up view engine
const hbs = create({
	helpers: {
		ifEqual(a, b, option) {
			if (a == b) return option.fn(this);
		},
		ifLessThan(a, b, option) {
			if (a < b) return option.fn(this);
		},
		ifLessThanOrEqual(a, b, option) {
			if (a <= b) return option.fn(this);
		},
		sum:(a,b)=>a+b,
		statusConvert:(x)=>{
			if (x==-1) return "Khỏi bệnh";
			else return `F${x}`;
		}
	},
	defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routers
app.use('/patients', mdwAdmin.checkAdmin, mdwAccount.checkLogin, patientRouter);
app.use('/products', mdwAdmin.checkAdmin, mdwAccount.checkLogin, productRouter);
app.use(
	'/statistic',
	mdwAdmin.checkAdmin,
	mdwAccount.checkLogin,
	statisticRouter
);
app.use(
	'/productPackages',
	mdwAdmin.checkAdmin,
	mdwAccount.checkLogin,
	productPackageRouter
);
app.use(
	'/facilities',
	mdwAdmin.checkAdmin,
	mdwAccount.checkLogin,
	facilityRouter
);
app.use('/managers', mdwAdmin.checkAdmin, mdwAccount.checkLogin, managerRouter);
app.use('/account', mdwAdmin.checkAdmin, accountRouter);
app.use('/admin', adminRouter);
app.use('/patientUser',mdwAdmin.checkAdmin, mdwAccount.checkLogin, patientUserRouter);

app.use('/order/', mdwAdmin.checkAdmin, mdwAccount.checkLogin, orderRouter);

app.get('/', mdwAdmin.checkAdmin, mdwAccount.checkLogin, (req, res) => {
	if (req.user.role === 'manager') return res.redirect('/patients');
	if (req.user.role === 'admin') return res.redirect('/admin');
	res.redirect(`/patientUser/accountDetail/${req.user.username}`);
});

app.get('/check', mdwAdmin.checkAdmin, mdwAccount.checkLogin, (req, res) => {
	res.render('admin/accountHistory');
});

module.exports = app;
