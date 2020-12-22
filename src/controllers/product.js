const Product = require("../models/product");
const moment = require("moment");

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
    userId
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
  const { category } = req.params;
  if (category) {
    Product.find({ category: category, status: 1 }).exec((error, products) => {
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


exports.sortProductByExpiredAt = (req, res) => {
  Product.find({ status: 1 })
    .sort({ expiredAt: 1 })
    .exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) {
        total = products.length;
        return res.status(200).json({ products });
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
// exports.getProductsBySlug = (req, res) => {
//   const { slug } = req.params;
//   Category.findOne({ slug: slug })
//     .select("_id ")
//     .exec((error, category) => {
//       if (error) {
//         return res.status(400).json({ error });
//       }
//       if (category) {
//         Product.find({ category: category._id, status: "processing" }).exec(
//           (error, products) => {
//             if (error) {
//               return res.status(400).json({ error });
//             } else {
//               res.status(200).json({ products });
//             }
//             if (category.type) {
//               if (products.length > 0) {
//                 res.status(200).json({
//                   products,
//                   productsByPrice: {
//                     under5m: products.filter((product) => product.currentPrice <= 5000000),
//                     under10m: products.filter(
//                       (product) => product.currentPrice > 5000000 && product.currentPrice <= 10000000
//                     ),
//                     under15m: products.filter(
//                       (product) => product.currentPrice > 10000000 && product.price <= 15000000
//                     ),
//                     under20m: products.filter(
//                       (product) => product.currentPrice > 15000000 && product.currentPrice <= 20000000
//                     ),
//                     under30m: products.filter(
//                       (product) => product.currentPrice > 20000000 && product.currentPrice <= 30000000
//                     ),
//                   },
//                 });
//               }
//             } else {
//               res.status(200).json({ products });
//             }
//           }
//         );
//       }
//     });
// };

exports.getAllProducts = (req, res) => {
  Product.find({ status: 1 }).exec((error, products) => {
    if (error) {
      return res.status(400).json({ error });
    } else {

      res.status(200).json({ products });
    }
  });
};

exports.checkExpiredProducts = (req, res) => {
  Product.updateMany({ expiredAt: { $lt: Date()}}, {status: 0}).exec(
    (error) => {
      if (error) {
        return res.status(400).json({ error });
      } else {
        res.status(201).json({  message: "Updated Successfully..!" });
      }
    }
  );
};

exports.getProductByBrand = (req,res) => {
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
}
