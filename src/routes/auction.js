const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");
const router = express.Router();
const { createAuction, getAuctionbyProduct, getAuctionSuccessfullbyUser } = require("../controllers/auction");

router.post("/auction/create",createAuction);
router.get("/auction/getauctionbyproduct/:productId", getAuctionbyProduct);
router.get("/auction/getauctionsuccessfullbyuser/:productId", getAuctionSuccessfullbyUser)
module.exports = router;
