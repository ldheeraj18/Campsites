const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampSiteSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('CampSites', CampSiteSchema);