const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { createOrder } = require('../controllers/order');
const router = express.Router();


router.post('/order/create', createOrder);

module.exports = router;