const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utilities/AsyncWrapper');
const campsite = require('../controlers/campsites');
const { verifyUser, ValidateCampsite, isAuthor } = require('../middleware');
const multer = require('multer')
const { storage, cloudinary } = require('../cloudinary/index');
const upload = multer({ storage })



router.get('/', AsyncWrapper(campsite.index));

router.get('/new', verifyUser, campsite.renderNewCamp);

router.post('/', verifyUser, upload.array('image'), ValidateCampsite, AsyncWrapper(campsite.createNewCamp));

router.get('/:id', AsyncWrapper(campsite.viewCampsite));

router.get('/:id/edit', verifyUser, isAuthor, AsyncWrapper(campsite.renderEdit));

router.put('/:id', verifyUser, isAuthor, upload.array('image'), ValidateCampsite, AsyncWrapper(campsite.updateCampsite));

router.delete('/:id', verifyUser, isAuthor, AsyncWrapper(campsite.deleteCampsite));

module.exports = router;