const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');


router.get('/register', (req, res) => {
    res.render('Authentications/register');
});

router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'User Successfully Registered');
            res.redirect('/campsites')
        })

    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
})

router.get('/login', (req, res) => {
    res.render('Authentications/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const redirect = res.locals.redirectTo || '/campsites'
    req.flash('success', 'User Successfully Logged IN');
    res.redirect(redirect)
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out Successfully!');
        res.redirect('/campsites');
    });
});


module.exports = router