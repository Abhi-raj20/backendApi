const db = require("../config/db");
const User = db.User;
const {
  hashPassword,
  comparePassword,
  generateRandomNumber,
} = require("../helper/middleware");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const CryptoJS = require("crypto-js");
const UserSchema = db.User;
const sendMail = require("../helper/email");
const Msg = require("../helper/messages");

const bcrypt = require("bcryptjs");

// Function to register a new user
exports.userRegister = async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    let isUserExists = await User.findOne({ email: email });
    if (isUserExists) {
      return res.status(200).send({
        status: false,
        msg: Msg.emailExists,
      });
    } else {
      let newPassword = await hashPassword(password);


      let obj = {
        fullName: fullName,
        email: email,
        password: newPassword
      };

      // Insert the user data into the database
      let data = UserSchema.insertMany(obj);

      // If data insertion is successful
      if (data) {
        return res.status(200).send({
          status: true,
          msg: Msg.registerSuccess,
          data: data[0],
        });
      } else {
        // If data insertion fails, return an error response
        return res.status(200).send({
          status: false,
          msg: Msg.registerError,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: Msg.err,
    });
  }
};

// Function to handle user login
exports.userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    let isUserExists = await User.findOne({ email: email });

    // If user exists and is not null
    if (isUserExists && isUserExists !== null) {
      let pass = isUserExists.password;
      let checkPassword = await bcrypt.compare(password, pass);

      // If passwords match
      if (checkPassword) {
        const payload = { userId: isUserExists._id };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

        return res.status(200).send({
          status: true,
          msg: Msg.userLoggedIn,
          token: token,
          userId: isUserExists._id,
        });
      } else {
        return res.status(200).send({
          status: false,
          msg: Msg.inValidPassword,
        });
      }
    } else {
      return res.status(200).send({
        status: false,
        msg: Msg.inValidEmail,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: Msg.err,
    });
  }
};

// Function to verify OTP
exports.otpVerifyfn = async (req, res) => {
  try {
    let { email, otp } = req.body;

    let isUserExists = await User.findOne({ email: email });

    // If user exists
    if (isUserExists) {
      let code = isUserExists.code;
      // If the entered OTP matches the stored code
      if (code == otp) {
        // Return a success response
        return res.status(200).send({
          status: true,
          msg: Msg.otpVerified,
        });
      } else {
        // If the entered OTP is wrong, return an error response
        return res.status(200).send({
          status: true,
          msg: Msg.wrongOtp,
        });
      }
    } else {
      // If the user is already verified, return a response indicating that
      return res.status(200).send({
        status: true,
        msg: Msg.dataNotFound,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: Msg.err,
    });
  }
};

// Function to resend OTP for user verification
exports.resendOtpfn = async (req, res) => {
  try {
    let { email } = req.body;

    let isUserExists = await User.findOne({ email: email });

    // If user exists
    if (isUserExists) {
      let id = isUserExists._id;
      const randomNumber = await generateRandomNumber(10000, 20000);
      const filter = { _id: id };

      // Define the update operation to set the new OTP
      const update = {
        $set: {
          code: randomNumber,
        },
      };

      const check = await User.updateOne(filter, update);

      // If OTP update is successful
      if (check && check !== null) {
        await sendMail.mail(email, randomNumber);
        return res.status(200).send({
          status: true,
          msg: Msg.otpSend,
        });
      } else {
        return res.status(200).send({
          status: true,
          msg: Msg.otpNotSend,
        });
      }
    } else {
      return res.status(200).send({
        status: true,
        msg: Msg.dataNotFound,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: Msg.err,
    });
  }
};

// Function to change user password
exports.changePassword = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let { old_password, new_password } = req.body;

    // Find the user by ID in the database
    let isUserExists = await User.findOne({ _id: userId });

    // If user exists and is not null
    if (isUserExists && isUserExists !== null) {
      let getOldPassword = isUserExists.password;
      let checkPassword = await bcrypt.compare(old_password, getOldPassword);

      // If old password matches
      if (checkPassword) {
        let newPassword = await hashPassword(new_password);

        const filter = { _id: userId };
        const update = {
          $set: {
            password: newPassword,
          },
        };

        // Update user's password in the database
        const check = await User.updateOne(filter, update);

        if (check) {
          return res.status(200).send({
            status: true,
            msg: "Password Change Successfully",
          });
        } else {
          return res.status(200).send({
            status: true,
            msg: "Password not Change",
          });
        }
      } else {
        return res.status(200).send({
          status: false,
          msg: "Invalid password",
        });
      }
    } else {
      return res.status(200).send({
        status: false,
        msg: "User Not Exists",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: "Something went wrong",
    });
  }
};

// Function to send OTP for password reset
exports.forgetPasswordSendOtpFn = async (req, res) => {
  try {
    let { email } = req.body;

    let isUserExists = await User.findOne({ email: email });

    // If user exists with the provided email
    if (isUserExists) {
      const randomNumber = await generateRandomNumber(10000, 20000);
      const filter = { email: email };

      // Define update operation to set the new OTP
      const update = {
        $set: {
          code: randomNumber,
        },
      };

      // Update user's OTP in the database
      const check = await User.updateOne(filter, update);

      // If OTP update is successful
      if (check) {
        let emailSendFunction = await sendMail.mail(email, randomNumber);
        return res.status(200).send({
          status: true,
          msg: "otp send successfully",
        });
      }
    } else {
      return res.status(200).send({
        status: true,
        msg: "user not found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: "Something went wrong",
    });
  }
};

// Function to reset user password using OTP verification
exports.forgetPasswordFn = async (req, res) => {
  try {
    let { email, otp, password } = req.body;

    let isUserExists = await User.findOne({ email: email });

    if (isUserExists) {
      let code = isUserExists.code;

      if (code == otp) {
        let newPassword = await hashPassword(password); // Hash the new password

        const filter = { email: email };
        const update = {
          $set: {
            password: newPassword,
          },
        };

        const check = await User.updateOne(filter, update);

        if (check) {
          return res.status(200).send({
            status: true,
            msg: "Your Password Has Been Reset Successfully",
          });
        } else {
          return res.status(200).send({
            status: true,
            msg: "Your Password Could Not Be Reset",
          });
        }
      } else {
        return res.status(200).send({
          status: true,
          msg: "Invalid OTP",
        });
      }
    } else {
      return res.status(200).send({
        status: true,
        msg: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: "Something went wrong",
    });
  }
};

//show all User for Admin page
exports.showUser = async (req, res) => {
  try {
    const result = await User.find();
    if (result == null) {
      res.status(500).json({
        message: "Internal Server error",
      });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Update profile for User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Delete profile for User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
