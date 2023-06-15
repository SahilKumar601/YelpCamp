if (process.env.NODE_ENV!=="production") {
  require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash=require('connect-flash');
const campgrounds_route = require('./routes/campground_routes.js')
const review_route = require('./routes/review_routes.js');
const User_route=require('./routes/User_Routes.js');
const passport=require('passport')
const LocalStrategy=require('passport-local');
const User =require('./models/user.js')

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
.then(() => {
    console.log("Mongoose Connected Successfully");
})
.catch((err) => {
    console.log(err.message);
});

app.engine('ejs',ejsMate)
app.set("view enigne", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({extended:true}));
app.use(express.static(path.join(__dirname,'public')))
const sessionconfig={
  secret:'c#q2SAdin',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionconfig))
app.use(methodOverride("_method"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash('success')
  res.locals.currentUser=req.user;
  res.locals.error=req.flash('error')
  next();
})
app.use('/campgrounds',campgrounds_route)
app.use('/campgrounds/:id/reviews',review_route)
app.use('/',User_route)
app.get("/", (req, res) => { 
  res.render('home.ejs');
});
app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next) =>{
  const{ status=500}=err;
  if(!err.message)err.message='Something Went Wrong!!'
  res.status(status).render('error.ejs',{ err });
})

app.listen(5000, () => {
  console.log("Sever Started");
});
