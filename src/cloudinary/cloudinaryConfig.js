const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dstgdyuiv', 
    api_key: '469788431856488', 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

module.exports = cloudinary;
