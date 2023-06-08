const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const users=require('../controllers/users.js');
const passport = require('passport');
const {storeReturnTo}=require('../middleware.js'); 

router.get('/register',users.renderRegisterForm);

router.post('/register',users.registerUser);

router.get('/login',users.renderLoginForm);

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginUser);

router.get('/logout',users.logoutUser);

module.exports=router;