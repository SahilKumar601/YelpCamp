const express = require("express");
const app = express();
const path = require("path");
const ejsMate=require('ejs-mate');
require('dotenv').config()
const ExpressError=require('./utils/ExpressError.js');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const campgrounds_route = require('./routes/campground_routes.js')
const review_route = require('./routes/review_routes.js');
const User_route=require('./routes/User_Routes.js');
const passport=require('passport')
const LocalStrategy=require('passport-local');
const User =require('./models/user.js')
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet')
const dbUrl=process.env.url_db;
mongoose.connect(dbUrl)
.then(() => {
    console.log("Mongoose Connected Successfully");
})
.catch((err) => {
    console.log(err.message);
});

app.engine('ejs',ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({extended:true}));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
  replaceWith:'_'
}));
const store=MongoStore.create({
  mongoUrl:dbUrl,
  touchAfter:24*60*60,
  crypto:{
    secret:'c#q2SAdin',
  }
})
store.on('error',function (e){
  console.log('storage erroe',e);
})

const sessionconfig={
  store,
  name:'connection',
  secret:'c#q2SAdin',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    // secure:true,
    expires:Date.now + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionconfig))
app.use(methodOverride("_method"));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dvg0eo991/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

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
