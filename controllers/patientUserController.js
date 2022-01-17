const axios=require('axios')
const { getPatientInfoByUsername } = require('../models/patientModel');

async function showChargingPage (req, res) {
  res.render("account/addFund");
};

async function charging  (req, res)  {
 
  axios({
    method: "post",
    url: "https://mysterious-coast-09473.herokuapp.com/payment/charge",
    data: {
      authToken: req.cookies.token,
      amount: parseInt(req.body.amountInput),
    },
  })
    .then((raw) => raw.data)
    .then((response) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err.response.data);
      res.redirect("/");
    });
};

async function showPayOffDeptPage(req, res)  {};

async function payOffDept  (req, res)  {};

async function showAccountDetail(req, res) {
	if (req.user.role !== 'patient') res.redirect('/');
	var data = await getPatientInfoByUsername(req.params.id);

	res.render('patientUser/accountDetail', data);
}
async function showChargingPage(req, res) {
	res.render('account/addFund');
}

async function showPayOffDeptPage(req, res) {}

async function payOffDept(req, res) {}

module.exports = {
	showChargingPage,
	charging,
	showPayOffDeptPage,
	payOffDept,
	showAccountDetail,
};
