const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  payeeName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  share: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Account", accountSchema);
