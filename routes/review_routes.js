const express = require('express');
const router = express.Router({mergeParams:true});
const review_fun=require('../controllers/review.js');
const catchAsync=require('../utils/catchAsync');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js');


router.post('/',isLoggedIn,validateReview,catchAsync(review_fun.addreview));
  
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(review_fun.deletereview));

module.exports=router;