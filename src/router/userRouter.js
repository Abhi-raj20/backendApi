var express = require("express");
var app = express();
const controller = require("../controller/index");
const {
  validateUser,
  validateLogin,
  handleValidationErrors,
} = require("../helper/vallidation");
const { authenticateToken } = require("../helper/middleware");
const upload = require("../helper/upload");

app.post(
  "/register",
  validateUser,
  handleValidationErrors,
  controller.userController.userRegister
);
app.post("/otpVerify", controller.userController.otpVerifyfn);
app.post("/resendOtp", controller.userController.resendOtpfn);
app.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  controller.userController.userLogin
);

app.post(
  "/changePassword",
  authenticateToken,
  controller.userController.changePassword
);
app.post(
  "/forgetPasswordSendOtp",
  controller.userController.forgetPasswordSendOtpFn
);
app.post("/forgetPasswordFn", controller.userController.forgetPasswordFn);
app.post(
  "/upload",
  upload.array("files", 10),
  controller.mediaController.mediaUpload
);
app.post("/account", controller.accountController.createAccount);
app.get("/showUser", controller.userController.showUser);
app.put("/update/:id", controller.userController.updateUser);
app.delete("/delete/:id", controller.userController.deleteUser);



module.exports = app;
