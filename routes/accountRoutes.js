const router = require("express").Router();
const accountController = require("../controllers/accountController");
const passport = require("../middleware/passport");

router.get("/login", accountController.login);

router.get("/signup", accountController.signup);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/account/checkFirstLogin",
    failureRedirect:
      "/account/login?error=tên tài khoản hoặc mật khẩu không chính xác",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/account/login");
});

router.post("/signup", accountController.add);

router.get("/changePassword", accountController.changePassword);

router.post("/changePassword", accountController.postChangePassword);

router.get("/checkFirstLogin", accountController.checkFirstLogin);

router.get("/loginPayment", accountController.loginPayment);

router.post("/loginPayment", accountController.postLoginPayment);



module.exports = router;
