const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('user/register.ejs');
})
router.post('/register',async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const user=new User({username,email})
        const registeruser=await User.register(user,password);
        req.flash('success','Welcome To YelpCamp')
        res.redirect('/campgrounds')
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
})
router.get('/login',(req,res)=>{
    res.render('user/login.ejs')
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back!!!')
    res.redirect('/campgrounds')
})

module.exports=router;