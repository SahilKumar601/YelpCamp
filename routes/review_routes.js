const express = require('express');
const router = express.Router({mergeParams:true});
const {reviewSchema}=require('../schema.js')
const Campground= require('../models/campgrounds.js') 
const Review =require("../models/review.js")
const ExpressError=require('../utils/ExpressError.js')
const catchAsync=require('../utils/catchAsync')



const validateReview=(req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      msg=error.details.map(el => el.message).join(',')
      throw new ExpressError(msg,400)
    }
    else{
      next();
    }
  }

router.post("/", validateReview, catchAsync(async(req,res,next)=>{
    const camp=await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.review.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))
  
router.delete('/:reviewId',catchAsync(async(req,res)=>{
    const { id,reviewId }=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;