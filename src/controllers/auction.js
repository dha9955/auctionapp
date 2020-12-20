const e = require("express");
const Auction = require("../models/auction");
const Product = require("../models/product");

exports.createAuction = (req, res) => {
  Product.findOne({ _id: req.body.product }).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      const auction = new Auction({
        user: req.user._id,
        product: req.body.product,
        price: product.currentPrice + product.stepUp,
      });
      auction.save((error, auction) => {
        if (error) return res.status(400).json({ error });
        if (auction) {
          product.currentPrice = auction.price;
          product.save();
          return res.status(200).json({ auction });
        }
      });
    }
  });
};

exports.getAuctionbyProduct = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Auction.find({ product: productId }).exec((error, auctions) => {
      if (error) return res.status(400).json({ error });
      if (auctions) {
        total = auctions.length;
        res.status(200).json({ total, auctions });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
}