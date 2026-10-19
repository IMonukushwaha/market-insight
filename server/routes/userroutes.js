const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { validateUser, validatelogin, requireAuth } = require('../middlewares.js');
const usercontrollers = require("../controller/user");

router.post('/signup', validateUser, wrapAsync(usercontrollers.signup));

router.post('/login', validatelogin, wrapAsync(usercontrollers.login));

router.get('/check-auth', requireAuth, usercontrollers.checkAuth);

router.post('/logout', wrapAsync(usercontrollers.logout));

module.exports = router;
