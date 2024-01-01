const CampSites = require('../models/campSites');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MapboxToken;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campSites = await CampSites.find({});
    res.render('Campsites/index', { campSites });
};

module.exports.renderNewCamp = (req, res) => {
    res.render('Campsites/new');
};

module.exports.createNewCamp = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.CampSite.location,
        limit: 1
    }).send();
    const camp = new CampSites(req.body.CampSite);
    camp.geometry = geoData.body.features[0].geometry;
    camp.author = req.user._id;
    camp.image = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully Made a new Camping Site');
    res.redirect(`/campsites/${camp._id}`);
};

module.exports.viewCampsite = async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Oops Cannot find the CampSite!!!');
        res.redirect('/campsites');
    }
    res.render('Campsites/show', { camp });
};

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    if (!camp) {
        req.flash('error', 'Oops Cannot find the CampSite!!!');
        res.redirect('/campsites');
    }
    res.render('Campsites/edit', { camp });
}

module.exports.updateCampsite = async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findByIdAndUpdate(id, { ...req.body.CampSite });
    const imgs = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    camp.image.push(...imgs);
    if (req.body.deleteImages) {
        for (let img of req.body.deleteImages) {
            cloudinary.uploader.destroy(img);
        }
        await camp.updateOne({ $pull: { image: { fileName: { $in: req.body.deleteImages } } } });
    }
    await camp.save();
    req.flash('success', 'Successfully Updated the Camping Site');
    res.redirect(`/campsites/${camp._id}`);
};

module.exports.deleteCampsite = async (req, res) => {
    const { id } = req.params;
    await CampSites.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Camping Site');
    res.redirect('/campsites');
};  