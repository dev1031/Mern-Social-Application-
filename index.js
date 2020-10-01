require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const helmet= require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const isAuth = require('./Auth/auth');
const userId = require('./Auth/auth');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
//app.use(cors());
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    res.header("Access-Control-Allow-Credentials" ,'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Headers','POST, GET ,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method ==='OPTIONS'){
            return res.sendStatus(200);
        }
    next()
});

app.use(cookieParser());

app.use(morgan('short'));
app.use(isAuth);
app.use(userId);

app.use('/',userRoutes);
app.use('/',postRoutes);

mongoose.connect('mongodb+srv://dherendra_dev:dheeru101@cluster0.r8doy.mongodb.net/social_media_app?retryWrites=true&w=majority', {useNewUrlParser: true , useUnifiedTopology: true ,useFindAndModify: false }, (error , db )=>{
    console.log('DataBase Connected!!')
});

app.listen(PORT , ()=>{
    console.log( `Server is running at PORT:${PORT}`);
})