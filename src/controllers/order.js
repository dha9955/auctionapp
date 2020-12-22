const Order = require("../models/order");
const Address = require("../models/address");
const User = require("../models/user")
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
          user.address = address._id;
          user.save();
          const order = new Order({
            userId: req.body.userId,
            productId: req.body.productId,
            price: req.body.price,
            status: req.body.status,
            addressId: address._id,
          });
          order.save((error, order) => {
            if (error) return res.status(400).json({ error });
            if (order) {
              res.status(201).json({ address, order });
            }
          });
        }
      });
    }
  });
};
