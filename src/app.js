const express = require('express');
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');
const nftRoutes = require('./routes/nftRoutes')
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const port = process.env.SERVER_PORT;
const app = express();


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/uploads', express.static(path.join(__dirname,'../uploads')));
  

app.use(fileUpload());
app.use((req, res, next) => {
  res.locals.user = req.session.user; 
  next();
});
app.use('/auth', authRoutes);
app.use('/', mainRoutes);
app.use('/nft', nftRoutes);



app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
