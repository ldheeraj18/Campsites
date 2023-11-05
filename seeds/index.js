const mongoose = require('mongoose');
const CampSites = require('../models/campSites')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/Campsites');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await CampSites.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const camp = new CampSites(
            {
                location: `${cities[i].city}, ${cities[i].state}`,
                title: `${sample(descriptors)} ${sample(places)}`
            });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})