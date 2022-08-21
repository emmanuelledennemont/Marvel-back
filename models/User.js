const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    required: true,
    type: String,
  },
  account: {
    username: {
      required: true,
      type: String,
    },
  },

  token: String,
  hash: String,
  salt: String,
});

module.exports = User;