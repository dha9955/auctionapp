const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
    },
    username: {
      type: String,
      trim: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    rating: {
      type: Number,
    },
    contactNumber: { type: String },
    address: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Address",
    }],
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};

module.exports = mongoose.model("User", userSchema);
