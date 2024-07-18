// Importing necessary functions from the express-validator library
const { body, validationResult } = require("express-validator");

// Validation rules for user registration
const validateUser = [
  body("fullName").notEmpty().withMessage("Full Name must be required"),
  body("email").isEmail().withMessage("Email must be required"),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password should be eight"),
];

// Validation rules for user login
const validateLogin = [
  body("email").isEmail().withMessage("Email must be required"),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password should be eight"),
];

// Validation rules for note creation
const noteValidation = [
  body("title").notEmpty().withMessage("Title must be required"),
  body("description").notEmpty().withMessage("Description should be required"),
];

// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // If there are validation errors, return a 400 Bad Request response with the first error message
  if (!errors.isEmpty()) {
    return res.status(400).send({
      msg: errors.errors[0].msg,
    });
  }

  next();
};

// Exporting validation rules and error handling middleware
module.exports = {
  validateUser,
  validateLogin,
  noteValidation,
  handleValidationErrors,
};
