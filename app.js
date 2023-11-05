const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const CampSites = require('./models/campSites')
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/Campsites');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campsites', async (req, res) => {
    const campSites = await CampSites.find({});
    res.render('Campsites/index', { campSites });
})


app.get('/campsites/new', async (req, res) => {
    res.render('Campsites/new');
})

app.post('/campsites', async (req, res) => {
    const camp = new CampSites(req.body.CampSite);
    await camp.save();
    res.redirect(`/Campsites/${camp._id}`);
})
app.get('/campsites/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    res.render('Campsites/show', { camp });
})

app.put('/campsites/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findByIdAndUpdate(id, { ...req.body.CampSite });
    res.redirect(`/Campsites/${camp._id}`);
})

app.get('/campsites/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    res.render('Campsites/edit', { camp });
})

app.delete('/campsites/:id', async (req, res) => {
    const { id } = req.params;
    await CampSites.findByIdAndDelete(id);
    res.redirect('/campsites');
})

app.listen(3000, () => {
    console.log("Listening to port 3000");
})
