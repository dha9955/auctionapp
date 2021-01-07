const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const {
  createProduct,
  getProductById,
  getAllProducts,
  getProductByCategory,
  sortProductByExpiredAt,
  checkExpiredProducts,
  getProductByBrand,
  deleteProductbyId,
  getProductbyUser,
  validateProduct,
  getProductNotValidated,
  searchProduct,
  getProductHistory
} = require("../controllers/product");
const router = express.Router();

router.get("/product/getallproducts", getAllProducts)
router.post(
  "/product/create",
  createProduct
);
router.delete("/product/deleteproductbyid/:productId",deleteProductbyId )
router.patch("/product/checkexpiredproducts", checkExpiredProducts);
router.get("/product/getproductbyid/:productId", getProductById);
router.get("/product/getproductbycategory/:category",getProductByCategory)
router.get("/product/sortproductbyexpiredat", sortProductByExpiredAt)
router.get("/product/getproductbybrand/:brand", getProductByBrand)
router.get("/product/getproductbyuser/:userId", getProductbyUser)
router.patch("/product/validateproduct", validateProduct)
router.get("/product/getproductnotvalidated", getProductNotValidated);
router.get("/product/searchproduct",searchProduct);
router.get("/product/gethistory/:userId",getProductHistory);
module.exports = router;
