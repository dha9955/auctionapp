const mongoose = require("mongoose");
const auctionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
