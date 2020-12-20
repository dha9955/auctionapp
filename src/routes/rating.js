const express = require("express");
const { userMiddleware, requireSignin } = require("../common-middleware");
const router = express.Router();
const { createRating, getRatingByUser } = require("../controllers/rating");

router.get("/rating/getratingbyuser/:userId", getRatingByUser);
router.post("/rating/create", requireSignin, userMiddleware, createRating);

module.exports = router;
