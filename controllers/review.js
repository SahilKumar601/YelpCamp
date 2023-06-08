const Review = require('../models/review.js');
const Campground= require('../models/campgrounds.js'); 

module.exports.addreview=async(req,res,next)=>{
    const camp=await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.review.push(review);
    review.author=req.user._id;
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.deletereview=async(req,res)=>{
    const { id,reviewId }=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}