const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already taken"],
    required: true,
  },
  email: {
    type: String,
    unique: [true, "Account already exists with this emai address"],
    reuried: true,
  },
  password: {
    type: String,
    reuired: true,
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
