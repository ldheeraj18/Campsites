const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const campsite = require('./routes/campsite');
const reviews = require('./routes/review');

mongoose.connect('mongodb://127.0.0.1:27017/Campsites');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const configSession = {
    secret: 'secretkeyforsession',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}
app.use(session(configSession));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/campsites', campsite);
app.use('/campsites/:id/reviews', reviews);


app.all('*', (req, res, next) => {
    next(new ExpressError("Page not Found", 404));
})

app.use((err, req, res, next) => {
    const { statuscode = 500 } = err;
    if (!err.message) err.message = "OHH No Something Went Wrong!!!!!";
    res.status(statuscode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Listening to port 3000");
})
