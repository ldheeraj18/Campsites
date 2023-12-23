const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utilities/AsyncWrapper');
const campsite = require('../controlers/campsites');
const { verifyUser, ValidateCampsite, isAuthor } = require('../middleware');


router.get('/', AsyncWrapper(campsite.index));

router.get('/new', verifyUser, campsite.renderNewCamp);

router.post('/', verifyUser, ValidateCampsite, AsyncWrapper(campsite.createNewCamp));

router.get('/:id', AsyncWrapper(campsite.viewCampsite));

router.get('/:id/edit', verifyUser, isAuthor, AsyncWrapper(campsite.renderEdit));

router.put('/:id', verifyUser, ValidateCampsite, isAuthor, AsyncWrapper(campsite.updateCampsite));

router.delete('/:id', verifyUser, isAuthor, AsyncWrapper(campsite.deleteCampsite));

module.exports = router;