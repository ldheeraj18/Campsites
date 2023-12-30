const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CloudanaryName,
    api_key: process.env.CloudanaryKey,
    api_secret: process.env.CloudanarySecret
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Campsites',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
});

module.exports = { storage, cloudinary };