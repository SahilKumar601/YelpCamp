const {campgroundSchema,reviewSchema}=require('./schema.js');
const ExpressError=require('./utils/ExpressError.js');
const Campground = require('./models/campgrounds.js');
const Review =require('./models/review.js');

module.exports.isLoggedIn =(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.returnTo=req.originalUrl;
        req.flash('error','Please Login First');
        return res.redirect('/login')
    }
    next();
}
module.exports.storeReturnTo =(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
}
module.exports.validation=(req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      msg=error.details.map(el => el.message).join(',')
      throw new ExpressError(msg,400)
    }
    else{
      next();
    }
  }
module.exports.isAuthor=async(req,res,next)=>{
  const {id}=req.params;
  const camp=await Campground.findById(id);
  if(!camp.author.equals(req.user._id)){
    req.flash('error','You Do not Have the Permission To Do That')
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
      req.flash('error','You Do not Have the Permission To Do That')
      return res.redirect(`/campgrounds/${id}`)
    }
    next();
  }
module.exports.validateReview=(req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      msg=error.details.map(el => el.message).join(',')
      throw new ExpressError(msg,400)
    }
    else{
      next();
    }
  }