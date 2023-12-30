const mongoose = require('mongoose');
const Review = require('./reviews');
const User = require('./user');
const Schema = mongoose.Schema;

const CampSiteSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: [{
        url: String,
        fileName: String
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }]
});

CampSiteSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('CampSite', CampSiteSchema);