const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    productPictures: [{  type: String }],
    condition: {
      type: String,
    },
    startPrice: {
      type: Number,
    },
    currentPrice: {
      type: Number,
    },
    stepUp: {
      type: Number,
    },
    buyNow: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
    },
    brand: {
      type: String,
    },
    expiredAt: {
      type: Date,
    },
    role: {
      type: Number,
      default: 1,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
