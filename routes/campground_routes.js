const express = require('express');
const router = express.Router();
const catchAsync=require('../utils/catchAsync.js');
const campground=require('../controllers/camgrounds.js')
const {isLoggedIn,isAuthor,validation}=require('../middleware.js');
const multer=require('multer');
const {storage}=require('../cloudinary/index.js');
const upload=multer({storage});

router.get("/", catchAsync(campground.index));

router.get("/new",isLoggedIn,campground.renderNewForm);

router.post("/",isLoggedIn,upload.array('images'),validation,catchAsync(campground.newCamp));

router.get("/:id", catchAsync(campground.showPage));

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campground.renderEditPage));

router.put("/:id",isLoggedIn,isAuthor,upload.array('images'),validation,catchAsync(campground.updateCamp));

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(campground.deletecamp));

module.exports=router