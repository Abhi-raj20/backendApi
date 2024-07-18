const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to hash the given password using bcrypt
exports.hashPassword = async (password, saltRounds = 10) => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password using the generated salt
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
  }

  return null;
};

// Function to compare the given password with a hash using bcrypt
exports.comparePassword = async (pass, hash) => {
  try {
    // Compare the provided password with the hash
    const match = await bcrypt.compare(pass.toString(), hash);
    if (match) {
      return match;
    }
  } catch (error) {
    console.log(error);
  }

  return false;
};

// Middleware function to authenticate a token
exports.authenticateToken = async (req, res, next) => {
  const authToken = req.header("Authorization");

  if (!authToken) return res.status(401).send("Please provide a token");

  // Extract the token from the authorization header (assuming it's prefixed with 'Bearer')
  let token = authToken.split(" ").slice(-1)[0];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.decoded = decoded;

    next();
  } catch (error) {
    res.status(403).send("Invalid token");
  }
};

// Function to generate a random number within the specified range
exports.generateRandomNumber = async (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
