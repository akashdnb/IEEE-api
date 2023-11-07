const express = require('express');
require('dotenv').config();
require('./db/conn');
const cors = require('cors');

const adminRoute = require('./routes/admin');
const apiRoute = require('./routes/api');
const path = require('path');
const hbs = require('hbs');

const PORT = 3000 || process.env.PORT

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


app.use(cors());
app.use("/admin", adminRoute);
app.use("/api", apiRoute);

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})