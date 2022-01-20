const Patient = require('../models/adminModel');
const Facility = require('../models/facilityModel');
const Manager = require('../models/managerModel');
const accountModel = require('../models/accountModel');
const admin = require('../models/adminModel');
async function dummy(req, res) {
	var data = await lockUser();
	console.log(data);
	res.send('dummy');
}

async function lockUser(req, res) {
	if (req.user.role != 'admin') return res.redirect('/');

	var data = await admin.lockUser(req.query.username);
	res.redirect('/admin');
}

async function unlockUser(req, res) {
	if (req.user.role != 'admin') return res.redirect('/');

	var data = await admin.unlockUser(req.query.username);
	res.redirect('/admin');
}

async function showDashboard(req, res) {
	if (req.user.role != 'admin') return res.redirect('/');
	var facilities = await Facility.getAllFacilities();
	var managers = await Manager.getAllManagers();
	res.render('admin/dashboard', {
		facilities,
		managers,
	});
}

async function create(req, res) {
	res.render('account/signup', { error: req.query.error });
}

async function postCreate(req, res) {
	const user = {
		username: req.body.username,
		password: req.body.password,
	};
	if (await accountModel.add(user, 'admin')) res.redirect('/account/login');
	else res.redirect('/admin/create?error=tài khoản đã được sử dụng');
}

module.exports = {
	dummy,
	//showPatientList,
	lockUser,
	unlockUser,
	showDashboard,
	create,
	postCreate,
};
