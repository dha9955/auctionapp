const e = require("express");
const Auction = require("../models/auction");
const Product = require("../models/product");
const User = require("../models/user")

exports.createAuction = (req, res) => {
  Product.findOne({ _id: req.body.product }).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      const auction = new Auction({
        user: req.body.userId,
        product: req.body.product,
        price: product.currentPrice + product.stepUp,
        status: 0,
      });
      auction.save((error, auction) => {
        if (error) return res.status(400).json({ error });
        if (auction) {
          product.currentPrice = auction.price;
          product.auction.push(auction._id)
          product.save();
          return res.status(201).json({ auction });
        }
      });
    }
  });
};

exports.getAuctionbyProduct = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Auction.find({ product: productId }).populate({path:"user",select: "_id username"}).exec((error, auctions) => {
      if (error) return res.status(400).json({ error });
      if (auctions) {
        return res.status(200).json({ auctions });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
}


exports.getAuctionSuccessfullbyUser = (req, res) => {
  const {userId} = req.params;
  Auction.find({user: userId, status:1}).populate({path:"product", select:"_id name"}).exec((error, auctions)=>{
    if (error) return res.status(400).json({ error });
    else {
      res.status(200).json({ auctions });
    }
  })
}