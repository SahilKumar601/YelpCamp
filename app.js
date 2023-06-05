const express = require("express");
const app = express();
const path = require("path");
const ejsMate=require('ejs-mate')
const catchAsync=require('./utils/catchAsync')
const {campgroundSchema}=require('./schema.js')
const ExpressError=require('./utils/ExpressError.js')
const mongoose = require("mongoose");
const Campground = require("./models/campgrounds");
const Review =require("./models/review.js")
const methodOverride = require("method-override");
const { error } = require("console");

mongoose
.connect("mongodb://127.0.0.1:27017/yelp-camp")
.then(() => {
    console.log("Mongoose Connected Successfully");
})
.catch((err) => {
    console.log(err.message);
});

const validation=(req,res,next)=>{
  const { error } = campgroundSchema.validate(req.body);
  // console.log(result)
  if (error) {
    msg=error.details.map(el => el.message).join(',')
    throw new ExpressError(msg,400)
  }
  else{
    next();
  }
}
app.engine('ejs',ejsMate)
app.set("view enigne", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({extended:true}));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Yelp Camp Home Page");
});
app.get("/campgrounds", catchAsync(async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index.ejs", { camps });
}));
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});
app.post("/campgrounds",validation, catchAsync(async (req, res,next) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}));
app.get("/campgrounds/:id", catchAsync(async (req, res,next) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  res.render("campgrounds/show.ejs", { foundCamp });
}));
app.get("/campgrounds/:id/edit",catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    // res.send(id)
    const camp= await Campground.findById(id);
    res.render('campgrounds/edit.ejs',{ camp })
}))
app.put("/campgrounds/:id",catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const UpdateCamp=await Campground.findByIdAndUpdate(id,req.body.campground,{new:true})
    res.redirect(`/campgrounds/${UpdateCamp._id}`)
}))
app.delete("/campgrounds/:id",catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const delCamp=await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))
app.post("/campgrounds/:id/reviews",catchAsync(async(req,res,next)=>{
  const camp=await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
}))

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
