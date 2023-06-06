const express = require('express');
const router = express.Router();
const catchAsync=require('../utils/catchAsync.js')
const ExpressError=require('../utils/ExpressError.js')
const Campground = require("../models/campgrounds.js");
const { error } = require("console");
const {campgroundSchema}=require('../schema.js')

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

router.get("/", catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index.ejs", { camps });
}));
router.get("/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});
router.post("/",validation, catchAsync(async (req, res,next) => {
      const camp = new Campground(req.body.campground);
      await camp.save();
      req.flash('success','Campground Added!!!!');
      res.redirect(`/campgrounds/${camp._id}`);
}));
router.get("/:id", catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate('review');
    if (!foundCamp) {
      req.flash('error','Camground Not Found')
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show.ejs", { foundCamp });
}));
router.get("/:id/edit",catchAsync(async(req,res,next)=>{
      const {id}=req.params;
      // res.send(id)
      const camp= await Campground.findById(id);
      res.render('campgrounds/edit.ejs',{ camp })
}))
router.put("/:id",catchAsync(async(req,res,next)=>{
      const {id}=req.params
      const UpdateCamp=await Campground.findByIdAndUpdate(id,req.body.campground,{new:true})
      req.flash('success','Updated Successfully')
      res.redirect(`/campgrounds/${UpdateCamp._id}`)
}))
router.delete("/:id",catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const delCamp=await Campground.findByIdAndDelete(id);
    req.flash('delete','Campground Deleted!!')
    res.redirect('/campgrounds');
}))

module.exports=router