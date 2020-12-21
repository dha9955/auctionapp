const Address = require("../models/address");
const User = require("../models/user");

exports.createAddress = (req, res) => {
  const {
    mobileNumber,
    pinCode,
    detail,
    district,
    city,
    alternatePhone,
    addressType,
    userId,
  } = req.body;
  const address = new Address({
    mobileNumber: mobileNumber,
    pinCode,
    detail,
    district,
    city,
    alternatePhone,
    addressType,
    user: userId,
  });
  address.save((error, address) => {
    if (error) return res.status(400).json({ error });
    if (address) {
      User.findOne({ _id: req.user._id }).exec((error, user) => {
        if (error) return res.status(400).json({ error });
        else{
            user.address = address._id
            user.save();
            if (address) {
                res.status(201).json({ address });
              }
        }
      });
    }
  });
};

exports.getAddressByUser = (req, res) => {
  const { userId } = req.params;
  Address.find({ user: userId }).exec((error, address) => {
    if (error) return res.status(400).json({ error });
    if (address) {
      res.status(201).json({ address });
    }
  });
};
