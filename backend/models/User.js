const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  avatar: String,

  walletAddress: { type: String, lowercase: true },

  roles: {
    creator: { type: Boolean, default: false },
    developer: { type: Boolean, default: false }
  },

});

module.exports = mongoose.model("User", userSchema);
