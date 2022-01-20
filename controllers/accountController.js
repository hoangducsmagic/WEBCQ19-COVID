const accountModel = require("../models/accountModel");
const axios = require("axios");

exports.login = (req, res) => {
  if (req.user) {
    res.redirect("/");
    return;
  }
  res.render("account/login", { error: req.query.error });
};

exports.signup = (req, res) => {
  if (req.user.role != "admin") return res.redirect("/");
  res.render("account/signup", { error: req.query.error });
};
exports.add = async (req, res) => {
  if (req.user.role != "admin") return res.redirect("/");
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  if (await accountModel.add(user, "manager")) res.redirect("/account/login");
  else res.redirect("/account/signup?error=tài khoản đã được sử dụng");
};

exports.changePassword = (req, res) => {
  if (!req.user) {
    res.redirect("/account/login");
    return;
  }
  res.render("account/changePassword", {
    error: req.query.error,
    username: req.user.username,
  });
};

exports.postChangePassword = async (req, res) => {
  const user = {
    username: req.user.username,
    password: req.body.password,
    curPassword: req.body.curPassword,
  };
  if (await accountModel.changePassword(user)) res.redirect("/");
  else res.redirect("/account/changePassword?error=Mật khẩu cũ không đúng");
};

exports.checkFirstLogin = async (req, res) => {
  if (!req.user) return res.redirect("/");
  res.cookie("token", '');
  
  const checkFirstLogin = await accountModel.checkLogin(
    req.user.username,
    req.user.username
  );
  if (checkFirstLogin) res.redirect("/account/changePassword");
  else res.redirect("/");
};

exports.loginPayment = (req, res) => {
  if (!req.user) return res.redirect("/");
  if (req.cookies.token) return res.redirect('/')
  res.render("payment/loginPayment", { error: req.query.error });
};

exports.postLoginPayment = async (req, res) => {
  if (!req.user) return res.redirect("/");
  const token = await accountModel.loginPayment(req.body);
  if (token){
    res.cookie("token", token);
    if (req.query.url) return res.redirect(req.query.url);
    res.redirect("/");
  }
  else res.redirect('/account/loginPayment?error=tên tài khoản hoặc mật khẩu không chính xác')
};


