const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { getAddressById, getAddressByUser } = require('../controllers/address');
const router = express.Router();


router.get('/user/getaddressbyuser/:userId', getAddressByUser);
router.get('/address/:addressId', getAddressById)
module.exports = router;