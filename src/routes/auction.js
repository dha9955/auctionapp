const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");
const router = express.Router();
const { createAuction, getAuctionbyProduct, getAuctionSuccessfullbyUser, getAuctionbyUser } = require("../controllers/auction");

router.post("/auction/create",createAuction);
router.get("/auction/getauctionbyproduct/:productId", getAuctionbyProduct);
router.get("/auction/getauctionsuccessfullbyuser/:userId", getAuctionSuccessfullbyUser)
router.get("/auction/getauctionbyuser/:userId", getAuctionbyUser)
module.exports = router;
