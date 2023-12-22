const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utilities/AsyncWrapper');
const CampSites = require('../models/campSites')
const { verifyUser, ValidateCampsite, isAuthor } = require('../middleware');


router.get('/', AsyncWrapper(async (req, res) => {
    const campSites = await CampSites.find({});
    res.render('Campsites/index', { campSites });
}));

router.get('/new', verifyUser, (req, res) => {
    res.render('Campsites/new');
})

router.post('/', verifyUser, ValidateCampsite, AsyncWrapper(async (req, res) => {
    const camp = new CampSites(req.body.CampSite);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully Made a new Camping Site');
    res.redirect(`/campsites/${camp._id}`);
}));

router.get('/:id', AsyncWrapper(async (req, res) => {
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
}));

router.get('/:id/edit', verifyUser, isAuthor, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    if (!camp) {
        req.flash('error', 'Oops Cannot find the CampSite!!!');
        res.redirect('/campsites');
    }
    res.render('Campsites/edit', { camp });
}));

router.put('/:id', verifyUser, ValidateCampsite, isAuthor, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findByIdAndUpdate(id, { ...req.body.CampSite });
    req.flash('success', 'Successfully Updated the Camping Site');
    res.redirect(`/campsites/${camp._id}`);
}));

router.delete('/:id', verifyUser, isAuthor, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    await CampSites.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Camping Site');
    res.redirect('/campsites');
}));

module.exports = router;