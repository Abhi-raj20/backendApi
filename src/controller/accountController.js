var Account = require("../model/account.schema");
const Msg = require("../helper/messages");

exports.createAccount = async (req, res) => {
  try {
    let { userId, payeeName, accountNumber, shortCode, description, share } =
      req.body;

    let account = {
      userId: userId,
      payeeName: payeeName,
      accountNumber: accountNumber,
      shortCode: shortCode,
      description: description,
      share: share,
    };

    // Insert the Account Details add into the database
    let data = Account.insertMany(account);

    if (data) {
      return res.status(200).send({
        status: true,
        msg: Msg.AccSuccess,
      });
    } else {
      // If data insertion fails, return an error response
      return res.status(200).send({
        status: false,
        msg: Msg.AccError,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: Msg.err,
    });
  }
};
