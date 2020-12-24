const Order = require("../models/order");
const Address = require("../models/address");
const User = require("../models/user");
const Product = require("../models/product");

exports.createOrder = (req, res) => {
  const address = new Address({
    mobileNumber: req.body.mobileNumber,
    pinCode: req.body.pinCode,
    detail: req.body.detail,
    district: req.body.district,
    city: req.body.city,
    alternatePhone: req.body.alternatePhone,
    addressType: req.body.addressType,
    userId: req.body.userId,
  });
  address.save((error, address) => {
    if (error) return res.status(400).json({ error });
    if (address) {
      User.findOne({ _id: req.body.userId }).exec((error, user) => {
        if (error) return res.status(400).json({ error });
        else {
          user.address.push(address._id);
          user.save();
          Product.findOne({ _id: req.body.productId }).exec(
            (error, product) => {
              if (error) return res.status(400).json({ error });
              else {
                const order = new Order({
                  userId: req.body.userId,
                  productId: req.body.productId,
                  price: req.body.price,
                  status: req.body.status,
                  addressId: address._id,
                  star: 0,
                  seller: product.owner,
                });
                order.save((error, order) => {
                  if (error) return res.status(400).json({ error });
                  if (order) {
                    res.status(201).json({ address, order });
                  }
                });
              }
            }
          );
        }
      });
    }
  });
};

exports.getOrderbyUser = (req, res) => {
  const { userId } = req.params;
  Order.find({ userId: userId })
    .populate({ path: "productId", select: "_id name" })
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        res.status(200).json({ order });
      }
    });
};

exports.rateUser = (req, res) => {
  Order.findOne({ _id: req.body.orderId }).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      order.star = req.body.star;
      order.save();
      let count = 0;
      let total = 0;
      Order.find({ seller: order.seller }).exec((error, orders) => {
        if (error) return res.status(400).json({ error });
        else {
          for (let ord of orders) {
            if (ord.star != null) {
              count = count + 1;
              total = total + ord.star;
            }
          }
          User.findOne({ _id: order.seller }).exec((error, user) => {
            if (error) return res.status(400).json({ error });
            if (user) {
              user.rating = total / count;
              user.save();
              res.status(201).json({ message: " Thank you for rating ...." });
            }
          });
        }
      });
    }
  });
};
