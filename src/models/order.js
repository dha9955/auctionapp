const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Auction",
  },
  addressId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Address",
  }
});


module.exports = mongoose.model("Order", orderSchema);
