const userController = require("./userController");
const adminController = require("./adminController");
const mediaController = require("./mediaController");
const accountController = require("./accountController");

// Create an object to hold references to userController and adminController
const controller = {
  userController: userController,
  adminController: adminController,
  mediaController: mediaController,
  accountController: accountController,
};

module.exports = controller;
