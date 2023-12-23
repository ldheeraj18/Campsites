const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('Authentications/register');
};

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        req.login(newUser, (err) => {
            req.flash('success', 'User Successfully Registered');
            res.redirect('/campsites')
        })

    }
    catch (err) {
        console.log(err)
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('Authentications/login');
};

module.exports.loginUser = (req, res) => {
    const redirect = res.locals.redirectTo || '/campsites'
    req.flash('success', 'User Successfully Logged IN');
    res.redirect(redirect)
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out Successfully!');
        res.redirect('/campsites');
    });
};