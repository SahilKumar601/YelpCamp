const express = require("express");
const app = express();
const path = require("path");
const ejsMate=require('ejs-mate')
const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError.js')
const Campground = require("./models/campgrounds");
const {campgroundSchema,reviewSchema}=require('./schema.js')
const mongoose = require("mongoose");
const Review =require("./models/review.js")
const methodOverride = require("method-override");
const { error } = require("console");
const campgrounds_route = require('./routes/campground_routes.js')
const review_route = require('./routes/review_routes.js')

mongoose
.connect("mongodb://127.0.0.1:27017/yelp-camp")
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
app.use(methodOverride("_method"));
app.use('/campgrounds',campgrounds_route)
app.use('/campgrounds/:id/reviews',review_route)

app.get("/", (req, res) => {
    res.send("Yelp Camp Home Page");
});

// app.all('*',(req,res,next)=>{
//   next(new ExpressError('Page Not Found',404))
// })
app.use((err,req,res,next) =>{
  const{ status=500}=err;
  if(!err.message)err.message='Something Went Wrong!!'
  res.status(status).render('error.ejs',{ err });
})

app.listen(5000, () => {
  console.log("Sever Started");
});
