const multer = require('multer');
const path = require('path');

const maxSize = 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images'));
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + path.basename(file.originalname);

    req.body.imageUrls = req.body.imageUrls || [];
    req.body.imageUrls.push(`${process.env.BASE_URL}/images/${name}`);

    cb(null, name);
  }
});


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

module.exports = upload;
