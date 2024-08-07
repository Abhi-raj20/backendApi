var express = require("express");
var app = express();
const controller = require("../controller/index");
const {
  validateUser,
  validateLogin,
  handleValidationErrors,
} = require("../helper/vallidation");
const { authenticateToken } = require("../helper/middleware");

app.post(
  "/adminLogin",
  validateLogin,
  handleValidationErrors,
  controller.adminController.adminLogin
);
app.post(
  "/adminForgetPasswordSendOtp",
  controller.adminController.adminForgetPasswordSendOtpFn
);
app.post(
  "/adminForgetPasswordFn",
  controller.adminController.adminForgetPasswordFn
);
app.get("/showMedia", controller.mediaController.showMedia);

module.exports = app;
