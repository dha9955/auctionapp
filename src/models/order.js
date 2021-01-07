const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
      type: Number,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Address",
    },
    star: {
      type: Number,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    CheckoutTime: {
      type: Date,
    },
    status2: {
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
