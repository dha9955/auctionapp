const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");
const router = express.Router();
const {getUserbyId, getUserbyToken, updateUser2} = require("../controllers/user")

router.get("/user/:userId", requireSignin, userMiddleware, getUserbyId)

router.get("/getuserbytoken/:token", getUserbyToken)

router.patch("/user/updateuser", updateUser2)

module.exports = router;
