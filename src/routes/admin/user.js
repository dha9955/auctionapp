const express = require("express");
const { adminMiddleware, requireSignin } = require("../../common-middleware");
const router = express.Router();
const {getAllUsers} = require("../../controllers/admin/user")

router.get("/admin/getallusers", getAllUsers)

module.exports = router;
