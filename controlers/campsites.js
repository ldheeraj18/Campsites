const CampSites = require('../models/campSites')

module.exports.index = async (req, res) => {
    const campSites = await CampSites.find({});
    res.render('Campsites/index', { campSites });
};

module.exports.renderNewCamp = (req, res) => {
    res.render('Campsites/new');
};

module.exports.createNewCamp = async (req, res) => {
    const camp = new CampSites(req.body.CampSite);
    camp.author = req.user._id;
    await camp.save();
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
    req.flash('success', 'Successfully Updated the Camping Site');
    res.redirect(`/campsites/${camp._id}`);
};

module.exports.deleteCampsite = async (req, res) => {
    const { id } = req.params;
    await CampSites.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Camping Site');
    res.redirect('/campsites');
};  