const Product = require("../models/product");
const moment = require("moment");
const { paginationData } = require("../common-middleware/pagination");
const Auction = require("../models/auction");
const product = require("../models/product");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const user = require("../models/user");

exports.createProduct = (req, res) => {
  const {
    name,
    condition,
    startPrice,
    stepUp,
    buyNow,
    description,
    category,
    brand,
    time,
    userId,
  } = req.body;
  let productPictures = req.body.productPictures;
  const product = new Product({
    name: name,
    condition,
    startPrice,
    stepUp,
    buyNow,
    currentPrice: startPrice,
    description,
    productPictures,
    category,
    brand,
    owner: userId,
    expiredAt: moment().add(time, "d").format(),
  });
  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  });
};

exports.getProductById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId, status: 1 }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
exports.getProductByCategory = (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const { category } = req.params;
  if (category) {
    Product.find({ category: category, status: 1 }).exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) {
        total = products.length;
        const results = paginationData(products, page, limit);
        res.status(200).json({ total, results });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.sortProductByExpiredAt = (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  Product.find({ status: 1 })
    .sort({ expiredAt: 1 })
    .exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) {
        total = products.length;
        const results = paginationData(products, page, limit);
        return res.status(200).json({ total, results });
      }
    });
};

exports.sortDealInDay = (req, res) => {
  Product.find({ expiredAt: { $eq: Date() } }).exec((error, products) => {
    if (error) return res.status(400).json({ error });
    if (products) {
      console.log(moment(products.expiredAt).format());
      res.status(200).json({ products });
    }
  });
};

exports.getAllProducts = (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  Product.find({ status: 1 }).exec((error, products) => {
    if (error) {
      return res.status(400).json({ error });
    } else {
      total = products.length;
      const results = paginationData(products, page, limit);
      res.status(200).json({ total, results });
    }
  });
};

exports.checkExpiredProducts = (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anhdh6666@gmail.com",
      pass: "1700561583561Mo",
    },
  });
  Product.updateMany({ expiredAt: { $lt: Date() } }, { status: 2 }).exec(
    (error) => {
      if (error) {
        return res.status(400).json({ error });
      } else {
        Product.find({ status: 2 }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          } else {
            for (let pro of products) {
              Auction.findOne({
                product: pro._id,
                price: pro.currentPrice,
              }).exec((error, auction) => {
                if (error) {
                  return res.status(400).json({ error });
                } else if(auction) {
                  console.log(auction)
                  auction.status = 1;
                  auction.save().then(() => {
                    User.findOne({ _id: auction.user }).exec(
                      async (error, user) => {
                        if (error) {
                          return res.status(400).json({ error });
                        } else {
                          if (user.email) {
                            console.log(user.email);
                            const msg = {
                              from: "anhdh6666@gmail.com",
                              to: `${user.email}`,
                              subject: "Your auction is successful",
                              text:
                                "Congratulations!!! Your auction is successful. Please check & confirm it. Thank you!!!",
                            };
                            const info = await transporter.sendMail(msg);
                            console.log("Message sent: %s", info.messageId);
                          }
                        }
                      }
                    );
                  });
                }
              });
            }
          }
        });
        res.status(200).json({ message: "updated...." });
      }
    }
  );
};

exports.getProductByBrand = (req, res) => {
  const { brand } = req.params;
  if (brand) {
    Product.find({ brand: brand, status: 1 }).exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) {
        total = products.length;
        res.status(200).json({ total, products });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.deleteProductbyId = (req, res) => {
  const { productId } = req.params;
  Product.findOneAndDelete({ _id: productId }).exec((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ message: "Product Removed" });
    }
  });
};

exports.getProductbyUser = (req, res) => {
  const { userId } = req.params;
  Product.find({ owner: userId }).exec((error, products) => {
    if (error) return res.status(400).json({ error });
    if (products) {
      total = products.length;
      res.status(200).json({ total, products });
    }
  });
};

exports.getProductNotValidated = (req, res) => {
  Product.find({ status: 0 }).exec((error, products) => {
    if (error) return res.status(400).json({ error });
    else {
      res.status(200).json({ products });
    }
  });
};
exports.validateProduct = (req, res) => {
  Product.updateOne({ _id: req.body.productId }, { status: 1 }).exec(
    (error) => {
      if (error) return res.status(400).json({ error });
      else {
        return res.status(200).json({ message: "Product was validated...." });
      }
    }
  );
};

exports.sendmail = (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anhdh6666@gmail.com",
      pass: "1700561583561Mo",
    },
  });
  User.find({}).exec(async (error, users) => {
    if (error) return res.status(400).json({ error });
    else {
      for (let user of users) {
        if (user.email) {
          console.log(user.email);
          const msg = {
            from: "anhdh6666@gmail.com",
            to: `${user.email}`,
            subject: "Your auction is successful",
            text:
              "Congratulations!!! Your auction is successful. Please check & confirm it. Thank you!!!",
          };
          const info = await transporter.sendMail(msg);
          console.log("Message sent: %s", info.messageId);
        }
      }
      return res.status(200).json({ message: "Email Sent" });
    }
  });
};

exports.searchProduct = (req, res) => {
  const searchedField = req.query.name;
  Product.find({name:{$regex: searchedField, $options: '$i'}, status:1}).then(data=>{
    res.status(200).json({data})
  })
}