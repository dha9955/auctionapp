const Order = require("../models/order");
const Address = require("../models/address");
const User = require("../models/user");
const Product = require("../models/product");
const { paginationData } = require("../common-middleware/pagination");

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
          user.save().then(() => {
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
                  product.status = 4;
                  product.save().then(() => {
                    order.save((error, order) => {
                      if (error) return res.status(400).json({ error });
                      if (order) {
                        if ((order.status = 1)) {
                          order.CheckoutTime = new Date();
                        }
                        order.save().then(() => {
                          return res.status(201).json({ order });
                        });
                      }
                    });
                  });
                }
              }
            );
          });
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
      Order.find({ seller: order.seller, status: 1 }).exec((error, orders) => {
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

exports.getAllOrders = (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  Order.find({}).exec((error, orders) => {
    if (error) {
      return res.status(400).json({ error });
    } else {
      total = orders.length;
      const results = paginationData(orders, page, limit);
      return res.status(200).json({ total, results });
    }
  });
};

exports.checkedout = (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId },
    { status: 1, CheckoutTime: new Date() }
  ).exec((error) => {
    if (error) {
      return res.status(400).json({ error });
    } else {
      return res.status(200).json({ message: "Successful...." });
    }
  });
};

exports.getRevenuebyMonth = (req, res) => {
  // const {id} = req.params
  // Order.findOne({_id:id,status:1}).exec((error, orders)=>{
  //   if(error){
  //     return res.status(400).json({ error });
  //   }else{
  //     var m = orders.CheckoutTime.getMonth() + 1
  //     res.status(200).json({m})
  //   }
  // })
  const { month } = req.params;
  Order.find({ status: 1 }).exec((error, orders) => {
    if (error) {
      return res.status(400).json({ error });
    } else {
      let revenue = 0;
      for (let ord of orders) {
        if (ord.CheckoutTime.getMonth() + 1 == month) {
          console.log(ord.price);
          revenue = revenue + (ord.price * 10) / 100;
        }
      }
      console.log(revenue);
      return res.status(200).json({ revenue });
    }
  });
};
