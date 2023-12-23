const express = require('express');
const router = express.Router();

const authentications = require('../controlers/authentication');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');


router.get('/register', authentications.renderRegister);

router.post('/register', authentications.registerUser);

router.get('/login', authentications.renderLogin);

router.post('/login', storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    authentications.loginUser);

router.get('/logout', authentications.logoutUser);


module.exports = router