const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Address",
  },
  star: {
    type: Number,
  },
  comment:{
    type: String,
  }
});

module.exports = mongoose.model("Order", orderSchema);
