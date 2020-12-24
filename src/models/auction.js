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
    status:{
      type: Number,
      default:0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
