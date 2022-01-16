const axios=require('axios')

async function showChargingPage (req, res) {
  res.render("account/addFund");
};

async function charging  (req, res)  {
  console.log(req.cookies.token,req.body.amountInput);
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
      console.log(response);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err.response.data);
      res.redirect("/");
    });
};

async function showPayOffDeptPage(req, res)  {};

async function payOffDept  (req, res)  {};

module.exports={
    showChargingPage,
    charging,
    showPayOffDeptPage,
    payOffDept
}
