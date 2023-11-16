const multer = require('multer');
const cloudinary = require('../cloudinary/cloudinaryConfig');

const maxSize = 1024 * 1024;

const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
}).array('images', 5);

module.exports = (req, res, next) => {
  const folder = 'ieee-images'; 

  upload(req, res, (err) => {
    if (err) {
      return next(err);
    }

    const images = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: folder }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.url);
          }
        }).end(file.buffer);
      });
    });

    Promise.all(images)
      .then((imageUrls) => {
        req.body.images = imageUrls;
        next();
      })
      .catch((error) => {
        next(error);
      });
  });
};
