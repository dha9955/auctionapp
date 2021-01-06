const Order = require("../models/order");
const Address = require("../models/address");
const User = require("../models/user");
const Product = require("../models/product");
const { paginationData } = require("../common-middleware/pagination");
const easyinvoice = require("easyinvoice");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
// create order = send mail invoice
exports.createOrder = (req, res) => {
  const address = new Address({
    mobileNumber: req.body.mobileNumber,
    detail: req.body.detail,
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
  Order.find()
    .populate({ path: "productId", select: "_id name" })
    .populate({ path: "userId", select: "_id username" })
    .populate({ path: "seller", select: "_id username" })
    .exec((error, orders) => {
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

// exports.getRevenuebyMonth = (req, res) => {
//   Order.find({ status: 1 }).exec((error, orders) => {
//     if (error) {
//       return res.status(400).json({ error });
//     } else {
//       let revenue = 0;
//       for (let ord of orders) {
//         if (
//           ord.CheckoutTime.getMonth() + 1 == req.body.month &&
//           ord.CheckoutTime.getYear() == req.body.year
//         ) {
//           console.log(ord.price);
//           revenue = revenue + (ord.price * 10) / 100;
//         }
//       }
//       console.log(revenue);
//       return res.status(200).json({ revenue });
//     }
//   });
// };

//
exports.getRevenuebyMonth = (req, res) => {
  const {year} = req.params
  let data = [];
  Order.find().exec((error, orders) => {
    if (error) return res.status(400).json({ error });
    if(orders){
      let m1=0,m2=0, m3=0, m4=0, m5=0, m6=0, m7=0, m8=0,m9=0,m10=0,m11=0,m12=0;
      for(let ord of orders){
        if(ord.createdAt.getFullYear() == year){
          if(ord.createdAt.getMonth()+1 == 1){
            m1 = m1 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 2){
            m2 = m2 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 3){
            m3 = m3 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 4){
            m4 = m4 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 5){
            m5 = m5 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 6){
            m6 = m6 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 7){
            m7 = m7 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 8){
            m8 = m8 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 9){
            m9= m9 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 10){
            m10 = m10 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 11){
            m11 = m11 + (ord.price*10)/100;
          }
          if(ord.createdAt.getMonth()+1 == 12){
            m12 = m12 + (ord.price*10)/100;
          }
        }
      }
      data = [{
        "month1":m1,
        "month2":m2,
        "month3":m3,
        "month4":m4,
        "month5":m5,
        "month6":m6,
        "month7":m7,
        "month8":m8,
        "month9":m9,
        "month10":m10,
        "month11":m11,
        "month12":m12,
      }]
      return res.status(200).json({data})
    }
  });
};

// create invoice with pdf
exports.createInvoice = async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anhdh6666@gmail.com",
      pass: "1700561583561Mo",
    },
  });
  var data = {
    //"documentTitle": "RECEIPT", //Defaults to INVOICE
    currency: "VND",
    taxNotation: "vat", //or gst
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    logo: "https://www.easyinvoice.cloud/img/logo.png", //or base64
    //"logoExtension": "png", //only when logo is base64
    sender: {
      company: "AK98-K16",
      address: "1 Võ Văn Ngân",
      zip: "Linh Chiểu Thủ Đức TP HCM",
      city: "Việt Nam",
      country: "0975090995",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    // req.
    client: {
      company: "Client Corp",
      address: "Clientstreet 456",
      zip: "4567 CD",
      city: "Clientcity",
      country: "Clientcountry",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    invoiceNumber: "2020.0001",
    invoiceDate: "1-6-2021",
    products: [
      {
        quantity: "2",
        description: "Test1",
        tax: 6,
        price: 33.87,
      },
      {
        quantity: "4",
        description: "Test3",
        tax: 21,
        price: 10.45,
      },
    ],
    bottomNotice: "Kindly pay your invoice within 15 days.",
  };
  //Create your invoice! Easy!
  const result = await easyinvoice.createInvoice(data);
  await fs.writeFileSync("invoice.pdf", result.pdf, "base64");
  const msg = {
    from: "anhdh6666@gmail.com",
    to: "1607dha@gmail.com",
    subject: "Your auction is successful",
    text:
      "Dear Sir, this is your invoice about the product you pay at ak98-k16website. Please check careful and if something was wrong, please contact us about 5 days. One time again, thanks you to support my website",
    attachments: [
      {
        filename: "invoice.pdf",
        path: __dirname + "../../../invoice.pdf",
      },
    ],
  };
  const info = await transporter.sendMail(msg);
  return res.status(200).json({ message: "successful..." });
};
