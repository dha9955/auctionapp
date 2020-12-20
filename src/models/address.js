const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
  },
  detail: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    required: true,
  },
  alternatePhone: {
    type: String,
  },
  addressType: {
    type: String,
    required: true,
    enum: ["home", "work"],
    required: true,
  },
});


module.exports = mongoose.model("Address", addressSchema);
