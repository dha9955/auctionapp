const express = require('express');
const { signup, signin, signinSocialAccount, signout} = require('../controllers/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signinsocialaccount', signinSocialAccount);
router.post("/signout", signout);

module.exports = router;