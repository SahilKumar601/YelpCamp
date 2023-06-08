const express = require('express');
const router = express.Router({mergeParams:true});
const Campground= require('../models/campgrounds.js'); 
const Review =require("../models/review.js");
const ExpressError=require('../utils/ExpressError.js');
const catchAsync=require('../utils/catchAsync');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js');


router.post("/",isLoggedIn,validateReview,catchAsync(async(req,res,next)=>{
    const camp=await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.review.push(review);
    review.author=req.user._id;
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))
  
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
    const { id,reviewId }=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;