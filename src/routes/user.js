const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");
const router = express.Router();
const {getUserbyId, getUserbyToken} = require("../controllers/user")

router.get("/user/:userId", requireSignin, userMiddleware, getUserbyId)



router.get("/getuserbytoken", getUserbyToken)


module.exports = router;
