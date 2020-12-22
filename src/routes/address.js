const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { createAddress, getAddressByUser } = require('../controllers/address');
const router = express.Router();


router.get('/user/getaddressbyuser/:userId', getAddressByUser);

module.exports = router;