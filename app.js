const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campgrounds");
const methodOverride = require("method-override");

mongoose
.connect("mongodb://127.0.0.1:27017/yelp-camp")
.then(() => {
    console.log("Mongoose Connected Successfully");
})
.catch((err) => {
    console.log(err.message);
});

app.set("view enigne", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Yelp Camp Home Page");
});
app.get("/campgrounds", async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index.ejs", { camps });
});
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});
app.post("/campgrounds", async (req, res) => {
  const camp = new Campground(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
});
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  res.render("campgrounds/show.ejs", { foundCamp });
});
app.get("/campgrounds/:id/edit",async(req,res)=>{
    const {id}=req.params;
    // res.send(id)
    const camp= await Campground.findById(id);
    res.render('campgrounds/edit.ejs',{ camp })
})
app.put("/campgrounds/:id",async(req,res)=>{
    const {id}=req.params
    const UpdateCamp=await Campground.findByIdAndUpdate(id,req.body.campground,{new:true}) 
    res.redirect(`/campgrounds/${UpdateCamp._id}`)
})
app.delete("/campgrounds/:id",async(req,res)=>{
    const {id}=req.params
    const delCamp=await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
  console.log("Sever Started");
});
