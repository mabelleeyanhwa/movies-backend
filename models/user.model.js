const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
