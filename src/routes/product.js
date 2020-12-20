const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const {
  createProduct,
  getProductById,
  getAllProducts,
  getProductByCategory,
  sortProductByExpiredAt,
  checkExpiredProducts,
  getProductByBrand
} = require("../controllers/product");
const router = express.Router();

router.get("/product/getallproducts", getAllProducts)
router.post(
  "/product/create",
  requireSignin,
  userMiddleware,
  createProduct
);
router.patch("/product/checkexpiredproducts", checkExpiredProducts);
router.get("/product/getproductbyid/:productId", getProductById);
router.get("/product/getproductbycategory/:category",getProductByCategory)
router.get("/product/sortproductbyexpiredat", sortProductByExpiredAt)
router.get("/product/getproductbybrand/:brand", getProductByBrand)

module.exports = router;
