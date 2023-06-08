const express = require('express');
const router = express.Router();
const catchAsync=require('../utils/catchAsync.js');
const campground=require('../controllers/camgrounds.js')
const {isLoggedIn,isAuthor,validation}=require('../middleware.js');


router.get("/", catchAsync(campground.index));

router.get("/new",isLoggedIn,campground.renderNewForm);

router.post("/",isLoggedIn,validation, catchAsync(campground.newCamp));

router.get("/:id", catchAsync(campground.showPage));

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campground.renderEditPage));

router.put("/:id",isLoggedIn,isAuthor,catchAsync(campground.updateCamp));

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(campground.deletecamp));

module.exports=router