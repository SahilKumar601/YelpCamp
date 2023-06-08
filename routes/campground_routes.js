const express = require('express');
const router = express.Router();
const catchAsync=require('../utils/catchAsync.js');

const Campground = require("../models/campgrounds.js");
const { error } = require("console");
const {isLoggedIn,isAuthor,validation}=require('../middleware.js');


router.get("/", catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index.ejs", { camps });
}));
router.get("/new",isLoggedIn,(req, res) => {
    res.render("campgrounds/new.ejs");
});
router.post("/",isLoggedIn,validation, catchAsync(async (req, res,next) => {
      const camp = new Campground(req.body.campground);
      camp.author=req.user._id;
      await camp.save();
      req.flash('success','Campground Added!!!!');
      res.redirect(`/campgrounds/${camp._id}`);
}));
router.get("/:id", catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate({
      path:'review',
      populate:{
        path:'author'
      }
    }).populate('author');
    if (!foundCamp) {
      req.flash('error','Camground Not Found')
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show.ejs", { foundCamp });
}));
router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(async(req,res,next)=>{
      const {id}=req.params;
      // res.send(id)
      const camp= await Campground.findById(id);
      res.render('campgrounds/edit.ejs',{ camp })
}))
router.put("/:id",isLoggedIn,isAuthor,catchAsync(async(req,res,next)=>{
      const {id}=req.params;
      const UpdateCamp=await Campground.findByIdAndUpdate(id,req.body.campground,{new:true})
      req.flash('success','Updated Successfully')
      res.redirect(`/campgrounds/${UpdateCamp._id}`)
}))
router.delete("/:id",isLoggedIn,isAuthor,catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const delCamp=await Campground.findByIdAndDelete(id);
    req.flash('delete','Campground Deleted!!')
    res.redirect('/campgrounds');
}))


module.exports=router