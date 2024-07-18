const express = require("express");

var router = express.Router();

router.use("/router", require("./userRouter"));

router.use("/router", require("./adminRouter"));

module.exports = router;
