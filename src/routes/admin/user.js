const express = require("express");
const { adminMiddleware, requireSignin } = require("../../common-middleware");
const router = express.Router();
const {getAllUsers, lockUser} = require("../../controllers/user");
const { getAllProducts } = require("../../controllers/product");
const { getAllOrders } = require("../../controllers/order");
router.get("/admin/getallusers", getAllUsers)
router.get("/admin/getallproducts", getAllProducts)
router.get("/admin/getallorders", getAllOrders)
router.patch("/admin/lockuser", lockUser)
module.exports = router;
