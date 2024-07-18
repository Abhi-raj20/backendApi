const nodemailer = require("nodemailer");

// Define a function named 'mail' to send an email with OTP
module.exports.mail = async function (email, otp) {
  // Create a transporter object with Gmail SMTP settings
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465, // Port for secure SMTP (SSL)
    secure: true, // Enable secure connection
    logger: true, // Enable logging
    debug: true, // Enable debugging
    secureConnection: false, // Set secure connection to false
    auth: {
      user: "snapcatcha@gmail.com",
      pass: "jgwmavbcwmarkfgs",
    },
    tls: {
      rejectUnauthorized: true, // Reject unauthorized TLS connections
    },
  });

  // Define email options
  let mailOptions = {
    from: "snapcatcha@gmail.com",
    to: email,
    subject: "This Mail Is Form snap-catcha Project",
    html: `<p>Dear User,</p>
  <p>Your OTP for accessing your account is <strong>${otp}</strong>. Please do not share this OTP with anyone. This OTP is valid for a limited time and is intended to keep your account secure.</p>
  <p>Thank you,<br>SnapCatcha Project</p>`,
  };

  // Send email using transporter
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully", info.response);
    }
  });
};
