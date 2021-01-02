const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { createOrder, rateUser, getOrderbyUser, checkedout,getRevenuebyMonth} = require('../controllers/order');
const router = express.Router();


router.post('/order/create', createOrder);
router.patch('/order/rateuser', rateUser);
router.get('/order/getorderbyuser/:userId', getOrderbyUser)
router.patch('/order/checkedoutorder', checkedout)
router.get('/order/getrevenue/:month', getRevenuebyMonth)
module.exports = router;