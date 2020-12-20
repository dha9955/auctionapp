const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");
const router = express.Router();
const {getUserbyId} = require("../controllers/user")

router.get("/user/:userId", requireSignin, userMiddleware, getUserbyId)

module.exports = router;
