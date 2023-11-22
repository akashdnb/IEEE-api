const express = require('express');
require('dotenv').config();
require('./db/conn');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinary = require('./cloudinary/cloudinaryConfig')

const adminRoute = require('./routes/admin');
const apiRoute = require('./routes/api');
const path = require('path');
const hbs = require('hbs');

const PORT = process.env.PORT || 3000

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set('views', templates_path); 
hbs.registerPartials(partials_path);
app.set('view engine', 'hbs');
app.use(express.json());
app.use(cookieParser())


const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use("/admin", adminRoute);
app.use("/api", apiRoute);

app.get('/', (req, res) => {
  res.render('index')
})


const imagePath = 'folder_name/image_name'; 
const uploadOptions = { public_id: imagePath };

app.get('/upload', (req, res) => {

  const filePath = path.join(__dirname, '..', '/public/images/', "1699933984684-download.jpg");
  
  cloudinary.uploader.upload(filePath, uploadOptions, (error, result) => {
    if(error){
      console.log(error);
    }
    else{
      console.log(result);
    }
  });
  res.send("uploaded");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})