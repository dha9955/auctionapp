const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const {
  createOrder,
  rateUser,
  getOrderbyUser,
  checkedout,
  getRevenuebyMonth,
  createInvoice,
  updateOrder,
  getRevenuebyDay,
  getOrderbySeller,
} = require("../controllers/order");
const router = express.Router();

router.post("/order/create", createOrder);
router.patch("/order/rateuser", rateUser);
router.get("/order/getorderbyuser/:userId", getOrderbyUser);
router.patch("/order/checkedoutorder", checkedout);
router.get("/order/getrevenue/:year", getRevenuebyMonth);
router.post("/order/createinvoice", createInvoice);
router.patch("/order/updatestatus", updateOrder);
router.post("/order/getrevenuebydate", getRevenuebyDay);
router.get("/order/getorderbyseller/:userId", getOrderbySeller);
module.exports = router;
