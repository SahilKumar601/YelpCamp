const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const {storeReturnTo}=require('../middleware.js'); 

router.get('/register',(req,res)=>{
    res.render('user/register.ejs');
})
router.post('/register',async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const user=new User({username,email})
        const registeruser=await User.register(user,password);
        req.login(registeruser,err=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome To YelpCamp')
            res.redirect('/campgrounds')
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
})
router.get('/login',(req,res)=>{
    res.render('user/login.ejs')
})
router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success',`Welcome Back!!! ${req.user.username}`)
    const redirectUrl=res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})
router.get('/logout',(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','See you Soon!!!')
        res.redirect('./campgrounds')
    })
})
module.exports=router;