const express = require("express");
const { getForgetPasswordView, sendForgotPasswordLink, getResetPasswordView, resetThePassword } = require("../controllers/passwordController");
const router = express.Router();


//    /password/forgot-password
router.route("/forgot-password")
.get(getForgetPasswordView)
.post(sendForgotPasswordLink);


// password/reset-password/:userId/:token
router.route("/reset-password/:userId/:token")
.get(getResetPasswordView)
.post(resetThePassword);


module.exports = router;
