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
        price = Math.floor(Math.random() * 20) + 10;
        const camp = new CampSites(
            {
                location: `${cities[i].city}, ${cities[i].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                image: 'https://source.unsplash.com/collection/483251',
                description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est culpa laborum placeat veniam doloribus molestias eligendi dolores cum rem temporibus tempora animi corrupti ea, rerum quis optio nesciunt dignissimos voluptates!',
                price
            });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})