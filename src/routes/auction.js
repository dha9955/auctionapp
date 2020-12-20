const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");
const router = express.Router();
const { createAuction, getAuctionbyProduct } = require("../controllers/auction");

router.post("/auction/create", requireSignin ,userMiddleware,createAuction);
router.get("/auction/getauctionbyproduct/:productId", getAuctionbyProduct);
module.exports = router;
