const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utilities/AsyncWrapper');
const ExpressError = require('../utilities/ExpressError');
const CampSites = require('../models/campSites')
const { CampsiteValidation } = require('../Schema');


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


router.get('/', AsyncWrapper(async (req, res) => {
    const campSites = await CampSites.find({});
    res.render('Campsites/index', { campSites });
}));

router.get('/new', (req, res) => {
    res.render('Campsites/new');
})

router.post('/', ValidateCampsite, AsyncWrapper(async (req, res) => {
    const camp = new CampSites(req.body.CampSite);
    await camp.save();
    req.flash('success', 'Successfully Made a new Camping Site');
    res.redirect(`/campsites/${camp._id}`);
}));

router.get('/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id).populate('reviews');
    if (!camp) {
        req.flash('error', 'Oops Cannot find the CampSite!!!');
        res.redirect('/campsites');
    }
    res.render('Campsites/show', { camp });
}));

router.put('/:id', ValidateCampsite, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findByIdAndUpdate(id, { ...req.body.CampSite });
    req.flash('success', 'Successfully Updated the Camping Site');
    res.redirect(`/campsites/${camp._id}`);
}));

router.get('/:id/edit', AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    if (!camp) {
        req.flash('error', 'Oops Cannot find the CampSite!!!');
        res.redirect('/campsites');
    }
    res.render('Campsites/edit', { camp });
}));

router.delete('/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    await CampSites.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Camping Site');
    res.redirect('/campsites');
}));

module.exports = router;