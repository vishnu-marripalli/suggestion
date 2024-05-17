require('dotenv').config();

const expressLayout = require('express-ejs-layouts')
const express = require('express');
const app = express()
const port = 5000
const Connectdb = require('./src/server/config/db');
const session = require('express-session');
const cookieparser = require('cookie-parser');
const mongoconnect = require('connect-mongo');
const methodOverride = require('method-override');


app.use(express.static('public'));

//Template engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('layout','./layouts/main') 
app.set('views', './src/views')




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());
app.use(methodOverride('_method'));



app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: mongoconnect.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));


app.use('/',require('./src/server/routes/main'))
app.use('/faculty',require('./src/server/routes/admin'))
 
app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))


//connecting DB

Connectdb();