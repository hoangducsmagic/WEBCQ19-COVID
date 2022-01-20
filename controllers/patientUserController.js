const axios=require('axios')
const Patient= require('../models/patientModel');


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

async function showAccountDetail(req, res) {
	if (req.user.role !== 'patient') res.redirect('/');
	var data = await Patient.getPatientInfoByUsername(req.params.id);

	res.render('patientUser/accountDetail', data);
}
async function showChargingPage(req, res) {
	res.render('account/addFund');
}

async function showPayOffDebtPage(req, res) {
  var debtInfo=await Patient.getPatientDebtInfoByUsername(req.user.username);
  axios({
    method: "get",
    url: "https://mysterious-coast-09473.herokuapp.com/account/info",
    data: {
      authToken: req.cookies.token
    },
  })
    .then((raw) => raw.data)
    .then((response) => {
      res.render('patientUser/payoffDebt',{
        ...debtInfo,
        balance:response.data.balance
      })
    })
    .catch((err) => {
      res.render("payment/loginPayment", { error: err.response.data });
    });

  
}

async function payOffDebt(req, res) {
  var debtInfo=await Patient.getPatientDebtInfoByUsername(req.user.username);
  axios({
    method: "get",
    url: "https://mysterious-coast-09473.herokuapp.com/account/info",
    data: {
      authToken: req.cookies.token
    },
  })
    .then((raw) => raw.data)
    .then((response) => {
      var balance=response.data.balance;
      
      // not enough money
      if (req.body.amountInput>balance){
        res.render('patientUser/payoffDebt',{
          ...debtInfo,
          balance,
          error: "You have not enough money!"
        })
      } else {
        var paidAmount=Math.min(debtInfo.debt,req.body.amountInput);
        var remainDebt=debtInfo.debt-paidAmount;
        
        axios({
          method: "post",
          url: "https://mysterious-coast-09473.herokuapp.com/payment/pay",
          data: {
            authToken: req.cookies.token,
            amount: paidAmount
          },
        })
          
          .then(async () => {
            await Patient.updateDebtByUsername(remainDebt,req.user.username);
            res.redirect('/patientUser/payoffDebt');
          })
          .catch((err) => {
            console.log(err);
            res.render("/payment/loginPayment", { error: err.response.data });
          });

        
      }
    })
    .catch((err) => {
  
      res.render("payment/loginPayment", { error: err.response.data });
    });
}

module.exports = {
	showChargingPage,
	charging,
	showPayOffDebtPage,
	payOffDebt,
	showAccountDetail,
};
