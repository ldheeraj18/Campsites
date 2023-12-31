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
                author: "65832cd2653f30242e0219ee",
                location: `${cities[i].city}, ${cities[i].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est culpa laborum placeat veniam doloribus molestias eligendi dolores cum rem temporibus tempora animi corrupti ea, rerum quis optio nesciunt dignissimos voluptates!',
                price,
                image: [
                    {
                        url: 'https://res.cloudinary.com/dv9jav2oc/image/upload/v1703855698/Campsites/j6vnbv6g5eybob6uutbw.jpg',
                        fileName: 'Campsites/j6vnbv6g5eybob6uutbw',
                    },
                    {
                        url: 'https://res.cloudinary.com/dv9jav2oc/image/upload/v1703855698/Campsites/oblq1wsrpuwjchfgqcdc.jpg',
                        fileName: 'Campsites/oblq1wsrpuwjchfgqcdc',
                    }
                ]
            });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})