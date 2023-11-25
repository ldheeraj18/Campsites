const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const CampSites = require('./models/campSites')
const methodOverride = require('method-override');
const AsyncWrapper = require('./utilities/AsyncWrapper');
const ExpressError = require('./utilities/ExpressError');
const { CampsiteValidation } = require('./Schema');

mongoose.connect('mongodb://127.0.0.1:27017/Campsites');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

const ValidateCampsite = (req, res, next) => {
    const { error } = CampsiteValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(er => er.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campsites', AsyncWrapper(async (req, res) => {
    const campSites = await CampSites.find({});
    res.render('Campsites/index', { campSites });
}));


app.get('/campsites/new', (req, res) => {
    res.render('Campsites/new');
})

app.post('/campsites', ValidateCampsite, AsyncWrapper(async (req, res) => {
    // if (!req.body.campSites) throw new ExpressError('Invalid Campsites!!!!', 400);
    const camp = new CampSites(req.body.CampSite);
    await camp.save();
    res.redirect(`/Campsites/${camp._id}`);
}));

app.get('/campsites/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    res.render('Campsites/show', { camp });
}));

app.put('/campsites/:id', ValidateCampsite, AsyncWrapper(async (req, res) => {
    if (!req.body.campSites) throw new ExpressError('Invalid Campsites!!!!', 400);
    const { id } = req.params;
    const camp = await CampSites.findByIdAndUpdate(id, { ...req.body.CampSite });
    res.redirect(`/Campsites/${camp._id}`);
}));

app.get('/campsites/:id/edit', AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    res.render('Campsites/edit', { camp });
}));

app.delete('/campsites/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    await CampSites.findByIdAndDelete(id);
    res.redirect('/campsites');
}));

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
